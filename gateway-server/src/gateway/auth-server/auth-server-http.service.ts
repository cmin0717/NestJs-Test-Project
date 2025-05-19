import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthServerHttpService {
  private baseUrl!: string
  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.AUTH_SERVER_URL || 'http://localhost:3001'
  }

  async forward(req: Request) {
    const { method, originalUrl, body, user } = req

    const requestUrl = `${this.baseUrl}${originalUrl.replaceAll('/auth-server', '')}`
    const config = {
      headers: {
        'X-User-Data': user ? JSON.stringify(user) : undefined,
      },
    }

    try {
      switch (method) {
        case 'GET':
          return (await this.httpService.axiosRef.get(requestUrl, config)).data
        case 'POST':
          return (
            await this.httpService.axiosRef.post(requestUrl, body, config)
          ).data
        case 'PUT':
          return (await this.httpService.axiosRef.put(requestUrl, body, config))
            .data
        case 'PATCH':
          return (
            await this.httpService.axiosRef.patch(requestUrl, body, config)
          ).data
        case 'DELETE':
          return (await this.httpService.axiosRef.delete(requestUrl, config))
            .data
        default:
          throw new Error('Invalid method')
      }
    } catch (error) {
      if (error.isAxiosError) {
        const axiosError = error

        if (axiosError.response) {
          const { status, data } = axiosError.response

          throw new HttpException(data, status)
        }

        if (axiosError.request) {
          throw new HttpException('외부 서버에서 응답이 없습니다', 504)
        }
      }

      console.error('예상치 못한 에러:', error)
      throw error
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
    const userSet = [
      {
        email: 'admin@admin.com',
        password: '1234',
        role: 'ADMIN',
      },
      {
        email: 'operator@operator.com',
        password: '1234',
        role: 'OPERATOR',
      },
      {
        email: 'auditor@auditor.com',
        password: '1234',
        role: 'AUDITOR',
      },
      {
        email: 'user@user.com',
        password: '1234',
        role: 'USER',
      },
    ]

    for (const user of userSet) {
      await this.httpService.axiosRef.post(`${this.baseUrl}/user/signup`, user)
    }
  }
}
