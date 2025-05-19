import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { AuthServerHttpService } from './gateway/auth-server/auth-server-http.service'
import { EventServerHttpService } from './gateway/event-server/event-server-http.service'
import { Request } from 'express'
import { JwtAuthGuard } from './common/jwt.guard'
import {
  AccessGameInformationDto,
  DailyMonsterKillDto,
  PageVisitDto,
  PurchaseHistoryDto,
  UpdateAccessGameInformationDto,
  UpdateDailyMonsterKillDto,
} from './app.controller.dto'

@Controller()
@ApiTags('테스트 관련 API')
export class TestController {
  constructor(
    private readonly authServerHttpService: AuthServerHttpService,
    private readonly eventServerHttpService: EventServerHttpService,
  ) {}

  @Get('ping')
  @ApiOperation({ summary: '서버 상태 체크' })
  async ping(@Req() req: Request) {
    const authServer = await (async () => {
      try {
        return await this.authServerHttpService.forward(req)
      } catch (err: any) {
        return err.message
      }
    })()

    const eventServer = await (async () => {
      try {
        return await this.eventServerHttpService.forward(req)
      } catch (err: any) {
        return err.message
      }
    })()

    return {
      gatewayServer: 'ok',
      authServer,
      eventServer,
    }
  }

  @Post('make-data-set')
  @ApiOperation({ summary: '데이터 세트 생성' })
  async makeDataSet() {
    try {
      await this.authServerHttpService.makeDataSet()

      return '데이터 세트 생성 완료(데이터 생성은 한번만 이용해주세요)'
    } catch (error) {
      return '데이터 세트 생성 실패'
    }
  }

  @Get('user-activity-test/daily-monster-kills')
  @ApiOperation({ summary: '유저 몬스터 처치 횟수 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async dailyMonsterKills(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Get('user-activity-test/access-game-informations')
  @ApiOperation({ summary: '유저 게임 접속 정보 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async accessGameInformations(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Get('user-activity-test/purchase-histories')
  @ApiOperation({ summary: '유저 결제 정보 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async purchaseHistories(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Get('user-activity-test/page-visit')
  @ApiOperation({ summary: '유저 페이지 방문 조회' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async pageVisits(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Post('user-activity-test/daily-monster-kill')
  @ApiOperation({ summary: '유저 몬스터 처치 횟수 생성' })
  @ApiBody({ type: DailyMonsterKillDto })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async createDailyMonsterKill(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Post('user-activity-test/access-game-information')
  @ApiOperation({ summary: '유저 게임 접속 정보 생성' })
  @ApiBody({ type: AccessGameInformationDto })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async createAccessGameInformation(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Post('user-activity-test/purchase-history')
  @ApiOperation({ summary: '유저 결제 정보 생성' })
  @ApiBody({ type: PurchaseHistoryDto })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async createPurchaseHistory(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Post('user-activity-test/page-visit')
  @ApiOperation({ summary: '유저 페이지 방문 정보 생성 or 추가' })
  @ApiBody({ type: PageVisitDto })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async createPageVisit(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Patch('user-activity-test/daily-monster-kill/:id')
  @ApiOperation({ summary: '유저 몬스터 처치 횟수 수정' })
  @ApiBody({ type: UpdateDailyMonsterKillDto })
  @ApiParam({
    name: 'id',
    description: '유저 몬스터 처치 횟수 Id',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async updateDailyMonsterKill(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }

  @Patch('user-activity-test/access-game-information/:id')
  @ApiOperation({ summary: '유저 게임 접속 정보 수정' })
  @ApiBody({ type: UpdateAccessGameInformationDto })
  @ApiParam({
    name: 'id',
    description: '유저 게임 접속 정보 Id',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async updateAccessGameInformation(@Req() req: Request) {
    return await this.eventServerHttpService.forward(req)
  }
}
