import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { MakeEventDataSet, MakeRewardDataSet } from 'src/app.controller.dto'

@Injectable()
export class EventServerHttpService {
  private readonly baseUrl!: string
  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.EVENT_SERVER_URL || 'http://localhost:3002'
  }

  async forward(req: Request) {
    const { method, originalUrl, body, user } = req

    const requestUrl = `${this.baseUrl}${originalUrl.replaceAll('/event-server', '')}`
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

  async makeDataSet() {
    const userId = '6829eefaf9215c45a216f29e'

    const config = {
      headers: {
        'X-User-Data': JSON.stringify({ id: userId, role: 'ADMIN' }),
      },
    }

    const rewards = await Promise.all(
      MakeRewardDataSet.map(async (v) => {
        const res = await this.httpService.axiosRef.post(
          `${this.baseUrl}/reward`,
          v,
          config,
        )
        return res.data
      }),
    )

    await Promise.all(
      MakeEventDataSet.map(async (v) => {
        const res = await this.httpService.axiosRef.post(
          `${this.baseUrl}/event`,
          v,
          config,
        )

        const event = res.data

        await Promise.all(
          v.eventDetails.map((v1) => {
            const rewardId = rewards[v1.reward.index]._id
            return this.httpService.axiosRef.post(
              `${this.baseUrl}/event/detail/${event._id}`,
              {
                ...v1,
                reward: {
                  rewardId,
                  amount: v1.reward.amount,
                },
              },
              config,
            )
          }),
        )
      }),
    )
  }
}
