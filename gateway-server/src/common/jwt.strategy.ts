import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthServerHttpService } from 'src/gateway/auth-server/auth-server-http.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  static fromAuthCookieAsToken(req: Request): string | null {
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token
    }
    return null
  }

  constructor(private readonly authServerHttpService: AuthServerHttpService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.fromAuthCookieAsToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET || 'maple_story_jwt_secret',
    })
  }

  async validate(payload: any) {
    try {
      const user = await this.authServerHttpService.findOneById(payload.id)
      return { id: user._id, role: user.role }
    } catch (err) {
      return null
    }
  }
}
