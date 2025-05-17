import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { RewardService } from '../reward.service'

import { RewardHistoryState } from '../reward-history.schema'
import { HttpService } from '@nestjs/axios'

@Processor('REQUEST_ITEM_REWARD_QUEUE', { concurrency: 5 })
export class ItemRewardQueueConsumer extends WorkerHost {
  constructor(
    private readonly httpService: HttpService,
    private readonly rewardService: RewardService,
  ) {
    super()
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, rewardHistory } = job.data

    let rewardState = RewardHistoryState.COMPLETED

    try {
      if (!rewardHistory || !rewardHistory.reward.item) {
        throw new Error('Reward history not found')
      }

      const itemDto = {
        userId,
        item: rewardHistory.reward.item,
      }

      await this.httpService.axiosRef.post(
        `http://localhost:3001/user/item`,
        itemDto,
      )
    } catch (error) {
      rewardState = RewardHistoryState.FAILED
      throw error
    } finally {
      await this.rewardService.convertRewardHistoryState(
        rewardHistory.id,
        rewardState,
      )
    }
  }
}
