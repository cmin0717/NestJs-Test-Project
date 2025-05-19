import { Controller, Post, Req, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Request, Response } from 'express'
import { AuthServerHttpService } from '../auth-server-http.service'
import { LoginDto } from '../swagger-dto/auth.dto'

@Controller({ path: 'auth-server/auth' })
@ApiTags('인증 서버 - Auth')
export class AuthServerAuthController {
  constructor(private readonly authServerHttpService: AuthServerHttpService) {}

  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({
    summary: '로그인[모두 이용 가능]',
    description:
      '로그인 시 쿠키에 access_token을 저장합니다. 따로 로그아웃을 구현하지 않았기에 다른 아이디로 전환을 원하시는 경우 해당 아이디로 다시 로그인하면 됩니다.',
  })
  async login(@Req() req: Request, @Res() res: Response) {
    const token = await this.authServerHttpService.forward(req)

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    })

    return res.status(200).json({ message: '로그인 성공' })
  }
}
