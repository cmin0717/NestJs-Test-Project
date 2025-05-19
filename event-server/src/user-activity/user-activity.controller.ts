import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { UserActivityTestService } from './user-activity-test.service'
import {
  AccessGameInformationDto,
  DailyMonsterKillDto,
  PageVisitDto,
  PurchaseHistoryDto,
  UpdateAccessGameInformationDto,
  UpdateDailyMonsterKillDto,
} from './dto/user-activity-test.dto'
import { RequestUser, RequestUserData } from 'src/common/user.decorator'
import { ObjectIdPipe } from 'src/common/object-id-validator'

@Controller({ path: 'user-activity-test' })
export class UserActivityTestController {
  constructor(
    private readonly userActivityTestService: UserActivityTestService,
  ) {}

  @Get('daily-monster-kills')
  async dailyMonsterKills(@RequestUser() user: RequestUserData) {
    return this.userActivityTestService.dailyMonsterKills(user.id)
  }

  @Get('access-game-informations')
  async accessGameInformations(@RequestUser() user: RequestUserData) {
    return this.userActivityTestService.accessGameInformations(user.id)
  }

  @Get('purchase-histories')
  async purchaseHistories(@RequestUser() user: RequestUserData) {
    return this.userActivityTestService.purchaseHistories(user.id)
  }

  @Get('page-visit')
  async pageVisit(@RequestUser() user: RequestUserData) {
    return this.userActivityTestService.pageVisit(user.id)
  }

  @Post('daily-monster-kill')
  async createDailyMonsterKill(
    @RequestUser() user: RequestUserData,
    @Body() dto: DailyMonsterKillDto,
  ) {
    return this.userActivityTestService.createDailyMonsterKill(user.id, dto)
  }

  @Post('access-game-information')
  async createAccessGameInformation(
    @RequestUser() user: RequestUserData,
    @Body() dto: AccessGameInformationDto,
  ) {
    return this.userActivityTestService.createAccessGameInformation(
      user.id,
      dto,
    )
  }

  @Post('purchase-history')
  async createPurchaseHistory(
    @RequestUser() user: RequestUserData,
    @Body() dto: PurchaseHistoryDto,
  ) {
    return this.userActivityTestService.createPurchaseHistory(user.id, dto)
  }

  @Post('page-visit')
  async createOrUpdatePageVisit(
    @RequestUser() user: RequestUserData,
    @Body() dto: PageVisitDto,
  ) {
    return this.userActivityTestService.createOrUpdatePageVisit(user.id, dto)
  }

  @Patch('daily-monster-kill/:id')
  async updateDailyMonsterKill(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: UpdateDailyMonsterKillDto,
  ) {
    return this.userActivityTestService.updateDailyMonsterKill(id, dto)
  }

  @Patch('access-game-information/:id')
  async updateAccessGameInformation(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: UpdateAccessGameInformationDto,
  ) {
    return this.userActivityTestService.updateAccessGameInformation(id, dto)
  }
}
