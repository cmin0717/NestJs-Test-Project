import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DailyMonsterKill,
  DailyMonsterKillSchema,
} from './schema/daily-monster-kill.schema'
import {
  LoginInformation,
  LoginInformationSchema,
} from './schema/login-information.schema'
import { PageVisit, PageVisitSchema } from './schema/page-visit.schema'
import {
  PurchaseHistory,
  PurchaseHistorySchema,
} from './schema/purchase-history.schema'
import { UserActivityController } from './user-activity.controller'
import { UserActivityService } from './user-activity.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyMonsterKill.name, schema: DailyMonsterKillSchema },
      { name: LoginInformation.name, schema: LoginInformationSchema },
      { name: PurchaseHistory.name, schema: PurchaseHistorySchema },
      { name: PageVisit.name, schema: PageVisitSchema },
    ]),
  ],
  controllers: [UserActivityController],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
