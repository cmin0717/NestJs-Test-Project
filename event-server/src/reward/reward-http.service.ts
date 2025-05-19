import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'

@Injectable()
export class RewardHttpService {
  private readonly AUTH_SERVER_URL!: string

  constructor(private readonly httpService: HttpService) {
    this.AUTH_SERVER_URL =
      process.env.AUTH_SERVER_URL || 'http://localhost:3001'
  }

  private async patch(url: string, data: any) {
    try {
      const response = await this.httpService.axiosRef.patch(url, data)
      return response.data
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

  async requestUserCash(userId: string, eventDetailId: string, amount: number) {
    const url = `${this.AUTH_SERVER_URL}/user/cash/${userId}`
    const response = await this.patch(url, { eventDetailId, amount })
    return response.data
  }

  async requestUserItem(
    userId: string,
    eventDetailId: string,
    name: string,
    amount: number,
  ) {
    const url = `${this.AUTH_SERVER_URL}/user/item/${userId}`
    const response = await this.patch(url, { eventDetailId, name, amount })
    return response.data
  }

  async requestUserCoupon(
    userId: string,
    eventDetailId: string,
    name: string,
    amount: number,
  ) {
    const url = `${this.AUTH_SERVER_URL}/user/coupon/${userId}`
    const response = await this.patch(url, { eventDetailId, name, amount })
    return response.data
  }

  async getUserRequestSuccessHistory(userId: string, eventDetailId: string) {
    const url = `${this.AUTH_SERVER_URL}/user/userRequestSuccessHistory`
    const response = await this.httpService.axiosRef.get(url, {
      params: { userId, eventDetailId },
    })

    console.log(response.data)

    return response.data
  }
}
