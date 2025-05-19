import { HttpService } from '@nestjs/axios'
import { HttpException, Injectable } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
@Injectable()
export class RewardHttpService {
  private readonly AUTH_SERVER_URL!: string

  constructor(private readonly httpService: HttpService) {
    this.AUTH_SERVER_URL =
      process.env.AUTH_SERVER_URL || 'http://localhost:3001'
  }

  private axiosErrorHandler(error: any): never {
    if (!error.isAxiosError) {
      console.error('예상치 못한 에러:', error)
      throw error
    }

    if (error.response) {
      const { status, data } = error.response
      throw new HttpException(data, status)
    }

    if (error.request) {
      throw new HttpException('외부 서버에서 응답이 없습니다', 504)
    }

    throw error
  }

  private async get(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.httpService.axiosRef.get(url, config)
      return response
    } catch (error) {
      this.axiosErrorHandler(error)
    }
  }

  private async patch(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) {
    try {
      const response = await this.httpService.axiosRef.patch(url, data, config)
      return response
    } catch (error) {
      this.axiosErrorHandler(error)
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

  async requestGetUserSuccessHistory(userId: string, eventDetailId: string) {
    const url = `${this.AUTH_SERVER_URL}/user/userRequestSuccessHistory`

    const response = await this.get(url, { params: { userId, eventDetailId } })
    return response.data
  }
}
