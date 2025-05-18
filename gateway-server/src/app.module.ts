import { Module } from '@nestjs/common'
import { GatewayModule } from './gateway/gateway.module'
import { TestController } from './test.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    GatewayModule,
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
