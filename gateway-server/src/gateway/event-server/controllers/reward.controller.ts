import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { EventServerHttpService } from '../event-server-http.service'
import { Request } from 'express'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/jwt.guard'
import { Roles, RolesGuard } from 'src/common/role.guard'
import { RoleEnum } from 'src/gateway/auth-server/auth-server.enum'
import {
  RewardDto,
  RewardFilterDto,
  RewardHistoryFilterDto,
  RewardUpdateDto,
} from '../swagger-dto/reward.dto'

@Controller({ path: 'event-server/reward' })
@ApiTags('이벤트 서버 - Reward')
export class EventServerRewardController {
  constructor(
    private readonly eventServerHttpService: EventServerHttpService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '보상 리스트 조회[ADMIN, OPERATOR, AUDITOR 전용]' })
  @ApiQuery({ type: RewardFilterDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.AUDITOR)
  @ApiSecurity('jwt')
  async getRewards(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Get('/histories')
  @ApiOperation({ summary: '보상 요청 내역 조회[USER 전용]' })
  @ApiQuery({ type: RewardHistoryFilterDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @ApiSecurity('jwt')
  async getRewardHistory(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Get('/histories/admin')
  @ApiOperation({
    summary: '보상 요청 내역 조회[ADMIN, OPERATOR, AUDITOR 전용]',
  })
  @ApiQuery({ type: RewardHistoryFilterDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.AUDITOR)
  @ApiSecurity('jwt')
  async getRewardHistoryAdmin(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Post('/')
  @ApiOperation({ summary: '보상 생성[ADMIN, OPERATOR 전용]' })
  @ApiBody({ type: RewardDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  @ApiSecurity('jwt')
  async createReward(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Post('/request/:eventDetailId')
  @ApiOperation({ summary: '보상 요청[USER 전용]' })
  @ApiParam({
    name: 'eventDetailId',
    description: '이벤트 상세 아이디',
    type: String,
    example: '68298d73cfbe2617fe9eaa81',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @ApiSecurity('jwt')
  async requestReward(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Patch('/:rewardId')
  @ApiOperation({ summary: '보상 수정[ADMIN 전용]' })
  @ApiParam({
    name: 'rewardId',
    description: '보상 아이디',
    type: String,
    example: '68298d73cfbe2617fe9eaa81',
  })
  @ApiBody({ type: RewardUpdateDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiSecurity('jwt')
  async updateReward(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }
}
