import { Injectable } from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'

import { LoginDto } from './dto/auth.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.userService.findOneByEmailAndPassword(
      body.email,
      body.password,
    )

    return await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    })
  }
}
