import { Module } from '@nestjs/common'
import { GatewayModule } from './gateway/gateway.module'
import { RoutingModule } from './routing/routing.module'

@Module({
  imports: [GatewayModule, RoutingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
