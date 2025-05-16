import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { LoginDto } from './auth-server.dto'

@Injectable()
export class AuthHttpService {
  constructor(private readonly httpService: HttpService) {}

  async findOneById(userId: string) {
    const res = await this.httpService.axiosRef.get(
      `http://localhost:3001/user/findOneByUserId`,
      { params: { userId } },
    )

    return res.data
  }

  async login(body: LoginDto) {
    const res = await this.httpService.axiosRef.post(
      'http://localhost:3001/auth/login',
      body,
    )

    return res.data
  }
}
