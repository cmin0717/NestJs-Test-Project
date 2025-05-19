import { Module } from '@nestjs/common'
import { GatewayModule } from './gateway/gateway.module'
import { TestController } from './app.controller'

@Module({
  imports: [GatewayModule],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
