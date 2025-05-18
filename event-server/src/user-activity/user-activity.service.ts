import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DailyMonsterKill } from './schema/daily-monster-kill.schema'
import { LoginInformation } from './schema/login-information.schema'
import { PurchaseHistory } from './schema/purchase-history.schema'
import { PageVisit } from './schema/page-visit.schema'
import { format } from 'date-fns'
import { EventRequirementDto } from 'src/event/dto/event.dto'

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

  async checkRewardEligibility(
    userId: string,
    eventStartDate: Date,
    eventEndDate: Date,
    eventRequirementDto: EventRequirementDto,
  ): Promise<void> {
    const validations = [
      {
        condition: eventRequirementDto.specificAttendanceDates,
        check: () =>
          this.checkSpecificAttendanceDates(
            userId,
            eventRequirementDto.specificAttendanceDates,
          ),
        message: '특정 출석일 요구사항을 만족하지 않습니다',
      },
      {
        condition: eventRequirementDto.accumulatedAttendanceDays,
        check: () =>
          this.checkAccumulatedAttendanceDays(
            userId,
            eventStartDate,
            eventEndDate,
            eventRequirementDto.accumulatedAttendanceDays,
          ),
        message: '누적 출석일 요구사항을 만족하지 않습니다',
      },
      {
        condition: eventRequirementDto.accumulatedPcRoomTime,
        check: () =>
          this.checkAccumulatedPcRoomTime(
            userId,
            eventStartDate,
            eventEndDate,
            eventRequirementDto.accumulatedPcRoomTime,
          ),
        message: '누적 PC방 이용시간 요구사항을 만족하지 않습니다',
      },
      {
        condition: eventRequirementDto.dailyPcRoomTime,
        check: () =>
          this.checkDailyPcRoomTime(
            userId,
            eventRequirementDto.dailyPcRoomTime,
          ),
        message: '당일 PC방 이용시간 요구사항을 만족하지 않습니다',
      },
      {
        condition: eventRequirementDto.accumulatedPurchaseAmount,
        check: () =>
          this.checkAccumulatedPurchaseAmount(
            userId,
            eventStartDate,
            eventEndDate,
            eventRequirementDto.accumulatedPurchaseAmount,
          ),
        message: '누적 캐시 충전 요구사항을 만족하지 않습니다',
      },
      {
        condition: eventRequirementDto.dailyMonsterKillCount,
        check: () =>
          this.checkDailyMonsterKillCount(
            userId,
            eventRequirementDto.dailyMonsterKillCount,
          ),
        message: '당일 몬스터 처치 요구사항을 만족하지 않습니다',
      },
      {
        condition: eventRequirementDto.specificPageAccess,
        check: () =>
          this.checkSpecificPageAccess(
            userId,
            eventRequirementDto.specificPageAccess,
          ),
        message: '특정 페이지 방문 요구사항을 만족하지 않습니다',
      },
    ]

    for (const validation of validations) {
      if (validation.condition) {
        const isEligible = await validation.check()
        if (!isEligible) {
          throw new BadRequestException(validation.message)
        }
      }
    }
  }

  private async checkSpecificAttendanceDates(
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

  private async checkAccumulatedAttendanceDays(
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

  private async checkAccumulatedPcRoomTime(
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

  private async checkDailyPcRoomTime(userId: string, dailyPcRoomTime: number) {
    const currentDate = new Date()
    const dateString = format(currentDate, 'yyyy-MM-dd')
    const loginInfo = await this.loginInformationModel.findOne({
      userId,
      dateString,
    })

    if (!loginInfo) {
      return false
    }

    return loginInfo.dailyPcRoomAccumulatedTime >= dailyPcRoomTime
  }

  private async checkDailyMonsterKillCount(
    userId: string,
    dailyMonsterKillCount: number,
  ) {
    const currentDate = new Date()
    const dateString = format(currentDate, 'yyyy-MM-dd')
    const dailyMonsterKills = await this.dailyMonsterKillModel.findOne({
      userId,
      dateString,
    })

    if (!dailyMonsterKills) {
      return false
    }

    return dailyMonsterKills.monsterKillCount >= dailyMonsterKillCount
  }

  private async checkAccumulatedPurchaseAmount(
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

  // async checkAccumulatedMonsterKillCount(
  //   userId: string,
  //   accumulatedMonsterKillCount: number,
  // ) {
  //   const currentDate = new Date()
  //   const dateString = format(currentDate, 'yyyy-MM-dd')

  //   const dailyMonsterKills = await this.dailyMonsterKillModel.find({
  //     userId,
  //     dateString
  // }

  private async checkSpecificPageAccess(
    userId: string,
    specificPageAccess: string,
  ) {
    const pageVisits = await this.pageVisitModel.findOne({
      userId,
    })

    if (!pageVisits) {
      return false
    }

    return pageVisits.visitedPages.includes(specificPageAccess)
  }
}
