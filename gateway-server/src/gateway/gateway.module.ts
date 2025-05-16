import { Module } from '@nestjs/common'
import { GatewayController } from './gateway.controller'
import { RoutingModule } from 'src/routing/routing.module'
import { JwtStrategy } from 'src/guard/jwt.strategy'

@Module({
  imports: [RoutingModule],
  controllers: [GatewayController],
  providers: [JwtStrategy],
})
export class GatewayModule {}
