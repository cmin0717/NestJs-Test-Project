import { HttpService } from '@nestjs/axios'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller({ path: 'test' })
@ApiTags('테스트 관련 API')
export class TestController {
  private readonly authServerUrl: string
  private readonly eventServerUrl: string
  constructor(private readonly httpService: HttpService) {
    this.authServerUrl = process.env.AUTH_SERVER_URL || 'http://localhost:3001'
    this.eventServerUrl =
      process.env.EVENT_SERVER_URL || 'http://localhost:3002'
  }

  @Get('ping')
  @ApiOperation({ summary: '서버 상태 체크' })
  async ping() {
    const authServer = await (async () => {
      try {
        const response = await this.httpService.axiosRef.get(
          this.authServerUrl + '/ping',
        )
        return response.data
      } catch (err: any) {
        return err.message
      }
    })()

    const eventServer = await (async () => {
      try {
        const response = await this.httpService.axiosRef.get(
          this.eventServerUrl + '/ping',
        )
        return response.data
      } catch (err: any) {
        return err.message
      }
    })()

    return {
      gatewayServer: 'ok',
      authServer,
      eventServer,
    }
  }
}
