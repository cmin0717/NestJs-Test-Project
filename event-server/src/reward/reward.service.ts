import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { Connection, Model } from 'mongoose'

import { Reward, RewardType } from './reward.schema'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RewardDto, RewardUpdateDto } from './reward.dto'
import { Promotion } from 'src/promotion/promotion.schema'
import { PromotionDetail } from 'src/promotion/promotion-detail.schema'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import {
  RewardHistoryState,
  RewardRequestHistory,
} from './reward-history.schema'
import { PromotionRequirementDto } from 'src/promotion/promotion.dto'
import { UserActivityService } from 'src/user-activity/user-activity.service'
import { CriticalSection } from 'src/distributed-lock/decorator/critical-section.decorator'
import { LockParam } from 'src/distributed-lock/decorator/lockable-param.decorator'

@Injectable()
export class RewardService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardRequestHistory.name)
    private readonly rewardHistoryModel: Model<RewardRequestHistory>,
    @InjectModel(Promotion.name)
    private readonly promotionModel: Model<Promotion>,
    @InjectModel(PromotionDetail.name)
    private readonly promotionDetailModel: Model<PromotionDetail>,
    @InjectQueue('REQUEST_ITEM_REWARD_QUEUE')
    private readonly itemRewardQueue: Queue,
    @InjectQueue('REQUEST_CASH_REWARD_QUEUE')
    private readonly cashRewardQueue: Queue,
    private readonly userActivityService: UserActivityService,
  ) {}

  async getRewards() {
    const rewards = await this.rewardModel.find().exec()
    return rewards.map((reward) => reward.toJSON())
  }

  async getReward(rewardId: string) {
    const reward = await this.rewardModel.findById(rewardId).exec()

    if (!reward) {
      throw new NotFoundException('Reward not found')
    }

    return reward.toJSON()
  }

  async getRewardHistories(userId: string) {
    const rewardHistories = await this.rewardHistoryModel
      .find({ userId })
      .exec()
    return rewardHistories.map((rewardHistory) => rewardHistory.toJSON())
  }

  async createReward(rewardDto: RewardDto) {
    const reward = new this.rewardModel(rewardDto)
    await reward.save()
    return reward.toJSON()
  }

  async updateReward(rewardId: string, rewardUpdateDto: RewardUpdateDto) {
    const reward = await this.getReward(rewardId)

    const updatedReward = await this.rewardModel.findByIdAndUpdate(
      reward.id,
      { $set: { ...rewardUpdateDto } },
      { new: true },
    )

    return updatedReward.toJSON()
  }

  @CriticalSection({ keyPrefix: 'REWARD_REQUEST' })
  async requestReward(
    @LockParam() promotionDetailId: string,
    @LockParam() userId: string,
  ) {
    const promotionDetail =
      await this.promotionDetailModel.findById(promotionDetailId)

    if (!promotionDetail) {
      throw new NotFoundException('Promotion detail not found')
    }

    const promotion = await this.promotionModel.findById(
      promotionDetail.promotionId,
    )

    if (!promotion) {
      throw new NotFoundException('Promotion not found')
    }

    if (!promotion.active || promotion.endDate < new Date()) {
      throw new BadRequestException('Promotion is Done or Not Active')
    }

    const reward = await this.rewardModel.findById(
      promotionDetail.reward.rewardId,
    )

    if (!reward) {
      throw new NotFoundException('Reward not found')
    }

    if (reward.type === RewardType.CASH && !promotionDetail.reward.amount) {
      throw new BadRequestException('Cash Reward amount is required')
    }

    if (reward.type === RewardType.ITEM && !promotionDetail.reward.count) {
      throw new BadRequestException('Item Reward count is required')
    }

    await this.checkRewardEligibility(
      userId,
      promotion.startDate,
      promotion.endDate,
      promotionDetail.option,
    )

    const session = await this.connection.startSession()
    try {
      return await session.withTransaction(async () => {
        await this.promotionDetailModel.findByIdAndUpdate(
          promotionDetailId,
          {
            $inc: { rewardCount: -1 },
          },
          { session },
        )

        const [rewardHistory] = await this.rewardHistoryModel.create(
          {
            userId,
            promotionId: promotion.id,
            promotionDetailId,
            reward: {
              rewardId: reward.id,
              title: reward.title,
              type: reward.type,
              count: promotionDetail.reward.count,
              amount: promotionDetail.reward.amount,
            },
          },
          { session },
        )

        const jobData = { userId, rewardHistory: rewardHistory.toJSON() }

        if (reward.type === RewardType.ITEM) {
          await this.itemRewardQueue.add(reward.type, jobData)
        } else {
          await this.cashRewardQueue.add(reward.type, jobData)
        }

        return rewardHistory.toJSON()
      })
    } finally {
      await session.endSession()
    }
  }

  async convertRewardHistoryState(
    rewardHistoryId: string,
    state: RewardHistoryState,
  ) {
    await this.rewardHistoryModel.findByIdAndUpdate(rewardHistoryId, {
      $push: { states: state },
      $set:
        state === RewardHistoryState.COMPLETED
          ? { isCompleted: true }
          : undefined,
    })
  }

  async increaseRewardHistoryCount(promotionDetailId: string, count: number) {
    await this.promotionDetailModel.findByIdAndUpdate(promotionDetailId, {
      $inc: { rewardCount: count },
    })
  }

  private async checkRewardEligibility(
    userId: string,
    promotionStartDate: Date,
    promotionEndDate: Date,
    promotionRequirementDto: PromotionRequirementDto,
  ) {
    const {
      specificAttendanceDates,
      accumulatedAttendanceDays,
      accumulatedPcRoomTime,
      todayPcRoomTime,
      accumulatedPurchaseAmount,
      specificPageAccess,
    } = promotionRequirementDto

    if (specificAttendanceDates) {
      const isEligible =
        await this.userActivityService.checkSpecificAttendanceDates(
          userId,
          specificAttendanceDates,
        )

      if (!isEligible) {
        throw new BadRequestException(
          'user is not eligible for specific attendance dates',
        )
      }
    }

    if (accumulatedAttendanceDays) {
      const isEligible =
        await this.userActivityService.checkAccumulatedAttendanceDays(
          userId,
          promotionStartDate,
          promotionEndDate,
          accumulatedAttendanceDays,
        )

      if (!isEligible) {
        throw new BadRequestException(
          'user is not eligible for accumulated attendance days',
        )
      }
    }

    if (accumulatedPcRoomTime) {
      const isEligible =
        await this.userActivityService.checkAccumulatedPcRoomTime(
          userId,
          promotionStartDate,
          promotionEndDate,
          accumulatedPcRoomTime,
        )

      if (!isEligible) {
        throw new BadRequestException(
          'user is not eligible for accumulated pc room time',
        )
      }
    }

    if (todayPcRoomTime) {
      const isEligible = await this.userActivityService.checkTodayPcRoomTime(
        userId,
        todayPcRoomTime,
      )

      if (!isEligible) {
        throw new BadRequestException(
          'user is not eligible for today pc room time',
        )
      }
    }

    if (accumulatedPurchaseAmount) {
      const isEligible =
        await this.userActivityService.checkAccumulatedPurchaseAmount(
          userId,
          promotionStartDate,
          promotionEndDate,
          accumulatedPurchaseAmount,
        )

      if (!isEligible) {
        throw new BadRequestException(
          'user is not eligible for accumulated purchase amount',
        )
      }
    }

    if (specificPageAccess) {
      const isEligible = await this.userActivityService.checkSpecificPageAccess(
        userId,
        specificPageAccess,
      )

      if (!isEligible) {
        throw new BadRequestException(
          'user is not eligible for specific page access',
        )
      }
    }
  }
}
