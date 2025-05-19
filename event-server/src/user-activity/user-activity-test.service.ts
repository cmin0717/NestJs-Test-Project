import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DailyMonsterKill } from './schema/daily-monster-kill.schema'
import { AccessGameInformation } from './schema/access-game-information.schema'
import { PurchaseHistory } from './schema/purchase-history.schema'
import { PageVisit } from './schema/page-visit.schema'
import {
  AccessGameInformationDto,
  DailyMonsterKillDto,
  PageVisitDto,
  PurchaseHistoryDto,
  UpdateAccessGameInformationDto,
  UpdateDailyMonsterKillDto,
} from './dto/user-activity-test.dto'

@Injectable()
export class UserActivityTestService {
  constructor(
    @InjectModel(DailyMonsterKill.name)
    private dailyMonsterKillModel: Model<DailyMonsterKill>,
    @InjectModel(AccessGameInformation.name)
    private accessGameInformationModel: Model<AccessGameInformation>,
    @InjectModel(PurchaseHistory.name)
    private purchaseHistoryModel: Model<PurchaseHistory>,
    @InjectModel(PageVisit.name)
    private pageVisitModel: Model<PageVisit>,
  ) {}

  async dailyMonsterKills(userId: string) {
    return this.dailyMonsterKillModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec()
  }

  async accessGameInformations(userId: string) {
    return this.accessGameInformationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec()
  }

  async purchaseHistories(userId: string) {
    return this.purchaseHistoryModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec()
  }

  async pageVisit(userId: string) {
    const pageVisit = await this.pageVisitModel.findOne({ userId }).exec()

    if (!pageVisit) {
      throw new NotFoundException('Page visit not found')
    }

    return pageVisit
  }

  async createDailyMonsterKill(userId: string, dto: DailyMonsterKillDto) {
    const dailyMonsterKill = new this.dailyMonsterKillModel({
      userId,
      ...dto,
    })

    return dailyMonsterKill.save()
  }

  async createAccessGameInformation(
    userId: string,
    dto: AccessGameInformationDto,
  ) {
    const accessGameInformation = new this.accessGameInformationModel({
      userId,
      ...dto,
    })

    return accessGameInformation.save()
  }

  async createPurchaseHistory(userId: string, dto: PurchaseHistoryDto) {
    const purchaseHistory = new this.purchaseHistoryModel({
      userId,
      ...dto,
    })

    return purchaseHistory.save()
  }

  async createOrUpdatePageVisit(userId: string, dto: PageVisitDto) {
    const pageVisit = await this.pageVisitModel.findOne({ userId }).exec()

    if (!pageVisit) {
      return this.pageVisitModel.create({
        userId,
        visitedPages: [dto.visitedPageUrl],
      })
    }

    if (!pageVisit.visitedPages.includes(dto.visitedPageUrl)) {
      return this.pageVisitModel.findOneAndUpdate(
        { userId },
        { $push: { visitedPages: dto.visitedPageUrl } },
        { new: true },
      )
    }

    return pageVisit
  }

  async updateDailyMonsterKill(id: string, dto: UpdateDailyMonsterKillDto) {
    const dailyMonsterKill = await this.dailyMonsterKillModel.findByIdAndUpdate(
      id,
      { $set: { monsterKillCount: dto.monsterKillCount } },
      { new: true },
    )

    if (!dailyMonsterKill) {
      throw new NotFoundException('Daily monster kill not found')
    }

    return dailyMonsterKill
  }

  async updateAccessGameInformation(
    id: string,
    dto: UpdateAccessGameInformationDto,
  ) {
    const accessGameInformation =
      await this.accessGameInformationModel.findByIdAndUpdate(
        id,
        { $set: { ...dto } },
        { new: true },
      )

    if (!accessGameInformation) {
      throw new NotFoundException('Access game information not found')
    }

    return accessGameInformation
  }
}
