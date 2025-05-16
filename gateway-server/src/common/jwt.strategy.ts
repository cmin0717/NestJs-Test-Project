import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthHttpService } from 'src/routing/auth-server/auth-http.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  static fromAuthCookieAsToken(req: Request): string | null {
    console.log(req.cookies)
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies.access_token
    }
    return null
  }

  constructor(private readonly authHttpService: AuthHttpService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.fromAuthCookieAsToken,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: 'maple_story_jwt_secret',
    })
  }

  async validate(payload: any) {
    console.log(payload)
    try {
      const user = await this.authHttpService.findOneById(payload.id)
      return { id: user.id, role: user.role }
    } catch (err) {
      return null
    }
  }
}
