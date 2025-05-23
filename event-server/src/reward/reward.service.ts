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
import { EventDetail } from 'src/event/schema/event-detail.schema'

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

  async getRewards(type?: RewardType): Promise<Reward[]> {
    const queryFilter: any = {}
    if (type) queryFilter.type = type

    return await this.rewardModel
      .find(queryFilter)
      .sort({ createdAt: -1 })
      .exec()
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
    if (filter.rewardId) queryFilter.rewardId = filter.rewardId
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
      cursorId: hasNextPage ? resultItems[resultItems.length - 1].id : null,
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
    const updatedReward = await this.rewardModel.findByIdAndUpdate(
      rewardId,
      { $set: { ...rewardUpdateDto } },
      { new: true },
    )

    if (!updatedReward) {
      throw new NotFoundException('Reward not found')
    }

    return updatedReward
  }

  @CriticalSection({ keyPrefix: 'REWARD_REQUEST' })
  async requestReward(
    @LockParam() userId: string,
    @LockParam() eventDetailId: string,
  ): Promise<RewardHistory> {
    // auth-server 에서 이벤트 참여 여부 확인
    const userRequestSuccessHistory =
      await this.rewardHttpService.requestGetUserSuccessHistory(
        userId,
        eventDetailId,
      )

    // 이미 이벤트 참여 했으면 예외 발생
    if (userRequestSuccessHistory) {
      throw new BadRequestException('Already requested reward')
    }

    // 이벤트, 이벤트 상세, 보상 조회
    const eventDetail = await this.eventService.getEventDetail(eventDetailId)
    const [event, reward] = await Promise.all([
      this.eventService.getActiveEvent(eventDetail.eventId.toString()),
      this.getReward(eventDetail.reward.rewardId),
    ])

    // 이벤트 상세 조건 만족 체크
    await this.userActivityService.checkRewardEligibility(
      userId,
      event,
      eventDetail.eventRequirement,
    )

    // 보상 지급
    return await this.processSendReward(userId, reward, eventDetail)
  }

  private async processSendReward(
    userId: string,
    reward: Reward,
    eventDetail: EventDetail,
  ) {
    // 이벤트 보상 수 먼저 처리(보상 수가 없을 시 이벤트 비활성화 처리)
    await this.handleRewardCount(eventDetail.eventId.toString(), eventDetail.id)

    const rewardHistoryForm = new this.rewardHistoryModel({
      userId,
      eventId: eventDetail.eventId.toString(),
      eventDetailId: eventDetail.id,
      rewardId: reward.id,
      amount: eventDetail.reward.amount,
    })

    try {
      // auth-server 에 보상 지급
      await this.sendRewardToUser(userId, reward, eventDetail)

      // 보상 지급 성공 시 히스토리 COMPLETED로 생성
      rewardHistoryForm.state = RewardHistoryState.COMPLETED
      return await rewardHistoryForm.save()
    } catch (error) {
      // 실패시 혹시 이미 보상 지급 성공 히스토리가 있는지 확인
      const userRequestSuccessHistory =
        await this.rewardHttpService.requestGetUserSuccessHistory(
          userId,
          eventDetail.id,
        )

      // 보상 지급 성공 히스토리가 있으면 COMPLETED로 생성 후 리턴
      if (userRequestSuccessHistory) {
        rewardHistoryForm.state = RewardHistoryState.COMPLETED
        return await rewardHistoryForm.save()
      } else {
        // 보상 지급 실패 시 롤백 처리 및 FAILED로 히스토리 생성
        await this.eventService.increaseAvailableRewardCount(eventDetail.id, 1)

        rewardHistoryForm.state = RewardHistoryState.FAILED
        await rewardHistoryForm.save()

        throw error
      }
    }
  }

  private async handleRewardCount(
    eventId: string,
    eventDetailId: string,
  ): Promise<void> {
    try {
      await this.eventService.increaseAvailableRewardCount(eventDetailId, -1)
    } catch (error) {
      if (
        error instanceof BadRequestException &&
        error.message === 'Event available reward count is not enough'
      ) {
        await this.eventService.updateEvent(eventId, { active: false })
      }
      throw error
    }
  }

  private async sendRewardToUser(
    userId: string,
    reward: Reward,
    eventDetail: EventDetail,
  ) {
    const amount = eventDetail.reward.amount
    const eventDetailId = eventDetail.id

    switch (reward.type) {
      case RewardType.CASH:
        await this.rewardHttpService.requestUserCash(
          userId,
          eventDetailId,
          amount,
        )
        break
      case RewardType.ITEM:
        await this.rewardHttpService.requestUserItem(
          userId,
          eventDetailId,
          reward.name,
          amount,
        )
        break
      case RewardType.COUPON:
        await this.rewardHttpService.requestUserCoupon(
          userId,
          eventDetailId,
          reward.name,
          amount,
        )
        break
      default:
        throw new Error('Invalid reward type')
    }
  }
}
