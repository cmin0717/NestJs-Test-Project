import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DailyMonsterKill } from './daily-monster-kill.schema'
import { LoginInformation } from './login-information.schema'
import { PurchaseHistory } from './purchase-history.schema'
import { PageVisit } from './page-visit.schema'
import { format } from 'date-fns'

@Injectable()
export class UserActivityService {
  constructor(
    @InjectModel(DailyMonsterKill.name)
    private dailyMonsterKillModel: Model<DailyMonsterKill>,
    @InjectModel(LoginInformation.name)
    private loginInformationModel: Model<LoginInformation>,
    @InjectModel(PurchaseHistory.name)
    private purchaseHistoryModel: Model<PurchaseHistory>,
    @InjectModel(PageVisit.name)
    private pageVisitModel: Model<PageVisit>,
  ) {}

  async checkSpecificAttendanceDates(
    userId: string,
    specificAttendanceDates: string[],
  ) {
    const userAttendanceDates = await this.loginInformationModel.find({
      userId,
      dateString: {
        $in: specificAttendanceDates,
      },
    })

    return (
      userAttendanceDates.length === specificAttendanceDates.length &&
      userAttendanceDates.every((attendanceDate) =>
        specificAttendanceDates.includes(attendanceDate.dateString),
      )
    )
  }

  async checkAccumulatedAttendanceDays(
    userId: string,
    promotionStartDate: Date,
    promotionEndDate: Date,
    accumulatedAttendanceDays: number,
  ) {
    const stringStartDate = format(promotionStartDate, 'yyyy-MM-dd')
    const stringEndDate = format(promotionEndDate, 'yyyy-MM-dd')

    const userAttendanceDates = await this.loginInformationModel.find({
      userId,
      dateString: {
        $gte: stringStartDate,
        $lte: stringEndDate,
      },
    })

    return userAttendanceDates.length >= accumulatedAttendanceDays
  }

  async checkAccumulatedPcRoomTime(
    userId: string,
    promotionStartDate: Date,
    promotionEndDate: Date,
    accumulatedPcRoomTime: number,
  ) {
    const stringStartDate = format(promotionStartDate, 'yyyy-MM-dd')
    const stringEndDate = format(promotionEndDate, 'yyyy-MM-dd')

    const loginInfos = await this.loginInformationModel.find({
      userId,
      dateString: {
        $gte: stringStartDate,
        $lte: stringEndDate,
      },
    })

    const totalPcRoomTime = loginInfos.reduce(
      (acc, curr) => acc + curr.dailyPcRoomAccumulatedTime,
      0,
    )

    return totalPcRoomTime >= accumulatedPcRoomTime
  }

  async checkTodayPcRoomTime(userId: string, todayPcRoomTime: number) {
    const currentDate = new Date()
    const dateString = format(currentDate, 'yyyy-MM-dd')
    const loginInfo = await this.loginInformationModel.findOne({
      userId,
      dateString,
    })

    if (!loginInfo) {
      return false
    }

    return loginInfo.dailyPcRoomAccumulatedTime >= todayPcRoomTime
  }

  async checkAccumulatedPurchaseAmount(
    userId: string,
    promotionStartDate: Date,
    promotionEndDate: Date,
    accumulatedPurchaseAmount: number,
  ) {
    const stringStartDate = format(promotionStartDate, 'yyyy-MM-dd')
    const stringEndDate = format(promotionEndDate, 'yyyy-MM-dd')

    const purchaseHistories = await this.purchaseHistoryModel.find({
      userId,
      dateString: {
        $gte: stringStartDate,
        $lte: stringEndDate,
      },
    })

    const totalPurchaseAmount = purchaseHistories.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    )

    return totalPurchaseAmount >= accumulatedPurchaseAmount
  }

  async checkSpecificPageAccess(userId: string, specificPageAccess: string) {
    const pageVisits = await this.pageVisitModel.findOne({
      userId,
    })

    if (!pageVisits) {
      return false
    }

    return pageVisits.visitedPages.includes(specificPageAccess)
  }
}
