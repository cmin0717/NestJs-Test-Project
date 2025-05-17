import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  RewardRequestHistory,
  RewardRequestHistorySchema,
} from './reward-history.schema'
import { Reward, RewardSchema } from './reward.schema'
import { RewardController } from './reward.controller'
import { RewardService } from './reward.service'
import { Promotion, PromotionSchema } from 'src/promotion/promotion.schema'
import {
  PromotionDetail,
  PromotionDetailSchema,
} from 'src/promotion/promotion-detail.schema'
import { BullModule } from '@nestjs/bullmq'
import { UserActivityModule } from 'src/user-activity/user-activity.module'
import { ItemRewardQueueConsumer } from './reward-queue/item-reward-queue.consumer'
import { CashRewardQueueConsumer } from './reward-queue/cash-reward-queue.consumer'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequestHistory.name, schema: RewardRequestHistorySchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: PromotionDetail.name, schema: PromotionDetailSchema },
    ]),
    BullModule.registerQueue(
      {
        name: 'REQUEST_ITEM_REWARD_QUEUE',
      },
      {
        name: 'REQUEST_CASH_REWARD_QUEUE',
      },
    ),
    HttpModule.register({
      timeout: 60000,
    }),
    UserActivityModule,
  ],
  controllers: [RewardController],
  providers: [RewardService, ItemRewardQueueConsumer, CashRewardQueueConsumer],
})
export class RewardModule {}
