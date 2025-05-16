import { Injectable, UnauthorizedException } from '@nestjs/common'

import { LoginDto } from './auth.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'src/user/user.schema'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { hashSHA256 } from 'src/common/util'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async login(body: LoginDto) {
    const hashedPassword = await hashSHA256(body.password)
    const user = await this.userModel.findOne({
      email: body.email,
      password: hashedPassword,
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = {
      id: user.id,
      role: user.role,
    }

    const token = await this.jwtService.signAsync(payload)

    return token
  }
}
