import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DailyMonsterKill,
  DailyMonsterKillSchema,
} from './schema/daily-monster-kill.schema'
import {
  AccessGameInformation,
  AccessGameInformationSchema,
} from './schema/access-game-information.schema'
import { PageVisit, PageVisitSchema } from './schema/page-visit.schema'
import {
  PurchaseHistory,
  PurchaseHistorySchema,
} from './schema/purchase-history.schema'
import { UserActivityTestController } from './user-activity.controller'
import { UserActivityService } from './user-activity.service'
import { UserActivityTestService } from './user-activity-test.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyMonsterKill.name, schema: DailyMonsterKillSchema },
      { name: AccessGameInformation.name, schema: AccessGameInformationSchema },
      { name: PurchaseHistory.name, schema: PurchaseHistorySchema },
      { name: PageVisit.name, schema: PageVisitSchema },
    ]),
  ],
  controllers: [UserActivityTestController],
  providers: [UserActivityService, UserActivityTestService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
