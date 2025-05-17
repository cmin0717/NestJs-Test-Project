import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

import { HttpService } from '@nestjs/axios'
import { RewardService } from '../reward.service'
import { RewardHistoryState } from '../reward-history.schema'

@Processor('REQUEST_CASH_REWARD_QUEUE', { concurrency: 5 })
export class CashRewardQueueConsumer extends WorkerHost {
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
      if (!rewardHistory || !rewardHistory.reward.amount) {
        throw new Error('Reward history not found')
      }

      const cashDto = {
        userId,
        cash: rewardHistory.reward.amount,
      }

      await this.httpService.axiosRef.post(
        `http://localhost:3001/user/cash`,
        cashDto,
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
