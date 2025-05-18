import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  RewardHistory,
  RewardHistorySchema,
} from './schema/reward-history.schema'
import { Reward, RewardSchema } from './schema/reward.schema'
import { RewardController } from './reward.controller'
import { RewardService } from './reward.service'
import { UserActivityModule } from 'src/user-activity/user-activity.module'
import { HttpModule } from '@nestjs/axios'
import { EventModule } from 'src/event/event.module'
import { RewardHttpService } from './reward-http.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardHistory.name, schema: RewardHistorySchema },
    ]),
    HttpModule.register({
      timeout: 60000,
    }),
    UserActivityModule,
    EventModule,
  ],
  controllers: [RewardController],
  providers: [RewardService, RewardHttpService],
})
export class RewardModule {}
