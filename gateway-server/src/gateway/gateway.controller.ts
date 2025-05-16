import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { JwtAuthGuard } from 'src/guard/jwt.guard'
import { Roles, RolesGuard } from 'src/guard/role.guard'
import { AuthHttpService } from 'src/routing/auth-server/auth-http.service'
import { LoginDto } from 'src/routing/auth-server/auth-server.dto'

@Controller()
export class GatewayController {
  constructor(private readonly authServer: AuthHttpService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getHello(): string {
    return 'ok'
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: LoginDto) {
    return await this.authServer.login(body)
  }
}
