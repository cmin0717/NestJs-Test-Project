import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { EventServerHttpService } from '../event-server-http.service'
import { Request } from 'express'
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import {
  EventDetailDto,
  EventDetailUpdateDto,
  EventDto,
  EventUpdateDto,
} from '../swagger/event.dto'
import { JwtAuthGuard } from 'src/common/jwt.guard'
import { Roles, RolesGuard } from 'src/common/role.guard'
import { RoleEnum } from 'src/gateway/auth-server/auth-server.enum'

@Controller({ path: 'event-server/event' })
@ApiTags('이벤트 서버 - Event')
export class EventServerEventController {
  constructor(
    private readonly eventServerHttpService: EventServerHttpService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '모든 이벤트 조회[모두 이용 가능]' })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async getEvents(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Get('/:eventId')
  @ApiOperation({ summary: 'Active 이벤트 상세 조회[모두 이용 가능]' })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 아이디',
    type: String,
    example: '68298d73cfbe2617fe9eaa81',
  })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('jwt')
  async getActiveEventWithDetail(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Post('/')
  @ApiOperation({ summary: '이벤트 생성[ADMIN, OPERATOR 전용]' })
  @ApiBody({ type: EventDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  @ApiSecurity('jwt')
  async createEvent(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Post('/detail/:eventId')
  @ApiOperation({ summary: '이벤트 상세 생성[ADMIN, OPERATOR 전용]' })
  @ApiBody({ type: EventDetailDto })
  @ApiParam({
    name: 'eventId',
    description: '부모 이벤트 아이디',
    type: String,
    example: '68298d73cfbe2617fe9eaa81',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  @ApiSecurity('jwt')
  async createEventDetail(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Patch('/:eventId')
  @ApiOperation({ summary: '이벤트 수정[ADMIN 전용]' })
  @ApiBody({ type: EventUpdateDto })
  @ApiParam({
    name: 'eventId',
    description: '이벤트 아이디',
    type: String,
    example: '68298d73cfbe2617fe9eaa81',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiSecurity('jwt')
  async updateEvent(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }

  @Patch('/detail/:eventDetailId')
  @ApiOperation({ summary: '이벤트 상세 수정[ADMIN 전용]' })
  @ApiBody({ type: EventDetailUpdateDto })
  @ApiParam({
    name: 'eventDetailId',
    description: '이벤트 상세 아이디',
    type: String,
    example: '68298d73cfbe2617fe9eaa81',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiSecurity('jwt')
  async updateEventDetail(@Req() req: Request) {
    return this.eventServerHttpService.forward(req)
  }
}
