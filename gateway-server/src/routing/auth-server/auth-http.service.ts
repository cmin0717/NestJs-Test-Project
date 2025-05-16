import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { LoginDto, RoleDto, SignupDto } from './auth-server.dto'

@Injectable()
export class AuthHttpService {
  constructor(private readonly httpService: HttpService) {}

  async login(body: LoginDto) {
    const res = await this.httpService.axiosRef.post(
      'http://localhost:3001/auth/login',
      body,
    )

    return res.data
  }

  async findOneById(userId: string) {
    const res = await this.httpService.axiosRef.get(
      `http://localhost:3001/user/findOneByUserId`,
      { params: { userId } },
    )

    return res.data
  }

  async signup(body: SignupDto) {
    const res = await this.httpService.axiosRef.post(
      'http://localhost:3001/user/signup',
      body,
    )

    return res.data
  }

  async updateUserRole(userId: string, body: RoleDto) {
    const res = await this.httpService.axiosRef.patch(
      `http://localhost:3001/user/role`,
      { ...body, userId },
    )

    return res.data
  }
}
