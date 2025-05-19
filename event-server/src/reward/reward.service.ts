import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Reward } from './schema/reward.schema'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  RewardDto,
  RewardHistoryFilterDto,
  RewardUpdateDto,
} from './dto/reward.dto'
import { RewardHistory } from './schema/reward-history.schema'
import { UserActivityService } from '../user-activity/user-activity.service'
import { CriticalSection } from '../distributed-lock/decorator/critical-section.decorator'
import { LockParam } from '../distributed-lock/decorator/lockable-param.decorator'
import { RewardType } from './enum/reward.enum'
import { RewardHistoryState } from './enum/reward-history.enum'
import { EventService } from '../event/event.service'
import { RewardHistoryPagingResponse } from './interface/reward-history.interface'
import { RewardHttpService } from './reward-http.service'

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
    @InjectModel(RewardHistory.name)
    private readonly rewardHistoryModel: Model<RewardHistory>,
    private readonly eventService: EventService,
    private readonly userActivityService: UserActivityService,
    private readonly rewardHttpService: RewardHttpService,
  ) {}

  async getRewards(): Promise<Reward[]> {
    return await this.rewardModel.find().exec()
  }

  async getReward(rewardId: string): Promise<Reward> {
    const reward = await this.rewardModel.findById(rewardId).exec()

    if (!reward) {
      throw new NotFoundException('Reward not found')
    }

    return reward
  }

  async getRewardHistories(
    filter: RewardHistoryFilterDto,
    limit: number,
  ): Promise<RewardHistoryPagingResponse> {
    const queryFilter: any = {}

    if (filter.userId) queryFilter.userId = filter.userId
    if (filter.eventId) queryFilter.eventId = filter.eventId
    if (filter.eventDetailId) queryFilter.eventDetailId = filter.eventDetailId
    if (filter.state) queryFilter.state = filter.state
    if (filter.rewardId) queryFilter['reward.rewardId'] = filter.rewardId
    if (filter.cursorId) queryFilter._id = { $lt: filter.cursorId }

    const items = await this.rewardHistoryModel
      .find({ ...queryFilter })
      .sort({ _id: -1 })
      .limit(limit + 1)
      .exec()

    const hasNextPage = items.length > limit
    const resultItems = hasNextPage ? items.slice(0, limit) : items
    return {
      items: resultItems,
      hasNextPage,
      cursor: hasNextPage
        ? resultItems[resultItems.length - 1].createdAt
        : null,
    }
  }

  async createReward(userId: string, rewardDto: RewardDto): Promise<Reward> {
    const reward = new this.rewardModel({
      ...rewardDto,
      makerUserId: userId,
    })

    return await reward.save()
  }

  async updateReward(
    rewardId: string,
    rewardUpdateDto: RewardUpdateDto,
  ): Promise<Reward> {
    const reward = await this.getReward(rewardId)

    const updatedReward = await this.rewardModel.findByIdAndUpdate(
      reward.id,
      { $set: { ...rewardUpdateDto } },
      { new: true },
    )

    return updatedReward
  }

  @CriticalSection({ keyPrefix: 'REWARD_REQUEST' })
  async requestReward(
    @LockParam() userId: string,
    @LockParam() eventDetailId: string,
  ): Promise<RewardHistory> {
    const rewardHistory = await this.rewardHistoryModel.findOne({
      userId,
      eventDetailId,
      state: RewardHistoryState.COMPLETED,
    })

    if (rewardHistory) {
      throw new BadRequestException('Already requested reward')
    }

    const eventDetail = await this.eventService.getEventDetail(eventDetailId)

    const [event, reward] = await Promise.all([
      this.eventService.getActiveEvent(eventDetail.eventId.toString()),
      this.getReward(eventDetail.reward.rewardId),
    ])

    await this.userActivityService.checkRewardEligibility(
      userId,
      event.startDate,
      event.endDate,
      eventDetail.eventRequirement,
    )

    const rewardHistoryForm = new this.rewardHistoryModel({
      userId,
      eventId: event.id,
      eventDetailId,
      rewardId: reward.id,
      amount: eventDetail.reward.amount,
    })

    try {
      await this.eventService.increaseAvailableRewardCount(eventDetail.id, -1)
    } catch (error) {
      if (
        error instanceof NotFoundException &&
        error.message === 'Event available reward count is not enough'
      ) {
        await this.eventService.updateEvent(event.id, { active: false })
      }

      throw error
    }

    try {
      await this.sendRewardToUser(userId, reward, eventDetail.reward.amount)

      rewardHistoryForm.state = RewardHistoryState.COMPLETED
      return await rewardHistoryForm.save()
    } catch (error) {
      await this.eventService.increaseAvailableRewardCount(eventDetail.id, 1)

      rewardHistoryForm.state = RewardHistoryState.FAILED
      await rewardHistoryForm.save()

      throw error
    }
  }

  private async sendRewardToUser(
    userId: string,
    reward: Reward,
    amount: number,
  ) {
    switch (reward.type) {
      case RewardType.CASH:
        await this.rewardHttpService.requestUserCash(userId, amount)
        break
      case RewardType.ITEM:
        await this.rewardHttpService.requestUserItem(
          userId,
          reward.name,
          amount,
        )
        break
      case RewardType.COUPON:
        await this.rewardHttpService.requestUserCoupon(
          userId,
          reward.name,
          amount,
        )
        break
      default:
        throw new Error('Invalid reward type')
    }
  }
}
