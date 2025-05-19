import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { MakeEventDataSet, MakeRewardDataSet } from 'src/app.controller.dto'
import {
  axiosErrorHandler,
  buildRequestConfig,
  executeRequest,
} from 'src/common/util'

@Injectable()
export class EventServerHttpService {
  private readonly baseUrl!: string
  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.EVENT_SERVER_URL || 'http://localhost:3002'
  }

  async forward(req: Request) {
    const { method, originalUrl, body, user } = req

    const requestUrl = `${this.baseUrl}${originalUrl.replaceAll('/event-server', '')}`
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

  // 테스트 데이터 생성을 위한 코드입니다. (무시하셔도 됩니다.)
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
