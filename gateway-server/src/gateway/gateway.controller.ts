import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { JwtAuthGuard } from 'src/common/jwt.guard'
import { Roles, RolesGuard } from 'src/common/role.guard'
import { User } from 'src/common/user.decorator'
import { AuthHttpService } from 'src/routing/auth-server/auth-http.service'
import {
  LoginDto,
  RoleDto,
  SignupDto,
} from 'src/routing/auth-server/auth-server.dto'

@Controller()
export class GatewayController {
  constructor(private readonly authServer: AuthHttpService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  getHello(): string {
    return 'ok'
  }

  @Post('auth-server/login')
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: LoginDto) {
    return await this.authServer.login(body)
  }

  @Post('auth-server/signup')
  @ApiOperation({ summary: '회원가입' })
  async signup(@Body() body: SignupDto) {
    return await this.authServer.signup(body)
  }

  @Patch('auth-server/user-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '유저 권한 업데이트' })
  async updateUserRole(@User() userId: string, @Body() body: RoleDto) {
    return await this.authServer.updateUserRole(userId, body)
  }
}
