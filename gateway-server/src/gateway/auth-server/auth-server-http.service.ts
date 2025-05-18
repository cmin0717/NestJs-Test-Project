import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthServerHttpService {
  private baseUrl!: string
  constructor(private readonly httpService: HttpService) {
    // config로 변경
    this.baseUrl = 'http://localhost:3001'
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

        // 응답이 있는 경우 (서버에서 응답이 왔을 때)
        if (axiosError.response) {
          const { status, data } = axiosError.response

          // 원본 상태 코드와 응답 데이터로 HttpException 생성
          throw new HttpException(data, status)
        }

        // 요청이 이루어졌으나 응답이 없는 경우 (타임아웃 등)
        if (axiosError.request) {
          throw new HttpException(
            '외부 서버에서 응답이 없습니다',
            504, // Gateway Timeout
          )
        }
      }

      // 기타 예외는 그대로 전파 (500 에러로 처리됨)
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
}
