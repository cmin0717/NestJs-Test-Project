import { HttpService } from '@nestjs/axios'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller({ path: 'test' })
@ApiTags('테스트 관련 API')
export class TestController {
  constructor(private readonly httpService: HttpService) {}

  @Get('ping')
  @ApiOperation({ summary: '서버 상태 체크' })
  async ping() {
    const authServer = await (async () => {
      try {
        const response = await this.httpService.axiosRef.get(
          'http://localhost:3001/ping',
        )
        return response.data
      } catch (err: any) {
        return err.message
      }
    })()

    const eventServer = await (async () => {
      try {
        const response = await this.httpService.axiosRef.get(
          'http://localhost:3002/ping',
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
