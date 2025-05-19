import { Controller, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from 'src/common/jwt.guard'
import { Roles, RolesGuard } from 'src/common/role.guard'
import { Request } from 'express'
import { AuthServerHttpService } from '../auth-server-http.service'
import { SignupDto, UpdateUserRoleDto } from '../swagger-dto/user.dto'
import { RoleEnum } from '../auth-server.enum'

@Controller({ path: 'auth-server/user' })
@ApiTags('인증 서버 - User')
export class AuthServerUserController {
  constructor(private readonly authServerHttpService: AuthServerHttpService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입[모두 이용 가능]' })
  @ApiBody({ type: SignupDto })
  async signup(@Req() req: Request) {
    return await this.authServerHttpService.forward(req)
  }

  @Patch('/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: '유저 권한 업데이트[ADMIN 전용]' })
  @ApiBody({ type: UpdateUserRoleDto })
  async updateUserRole(@Req() req: Request) {
    return await this.authServerHttpService.forward(req)
  }
}
