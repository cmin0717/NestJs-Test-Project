import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { MakeUserDataSet } from 'src/app.controller.dto'
import {
  axiosErrorHandler,
  buildRequestConfig,
  executeRequest,
} from 'src/common/util'

@Injectable()
export class AuthServerHttpService {
  private baseUrl!: string
  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.AUTH_SERVER_URL || 'http://localhost:3001'
  }

  async forward(req: Request) {
    const { method, originalUrl, body, user } = req

    const requestUrl = `${this.baseUrl}${originalUrl.replaceAll('/auth-server', '')}`
    const config = buildRequestConfig(user)

    try {
      return await executeRequest(
        method,
        requestUrl,
        body,
        this.httpService.axiosRef,
        config,
      )
    } catch (error) {
      axiosErrorHandler(error)
    }
  }

  async findOneById(userId: string) {
    const res = await this.httpService.axiosRef.get(
      `${this.baseUrl}/user/findOneByUserId`,
      { params: { userId } },
    )

    return res.data
  }

  async makeDataSet() {
    for (const user of MakeUserDataSet) {
      await this.httpService.axiosRef.post(`${this.baseUrl}/user/signup`, user)
    }
  }
}
