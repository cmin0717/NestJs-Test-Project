import { Module } from '@nestjs/common'

import { JwtStrategy } from 'src/common/jwt.strategy'

import { HttpModule } from '@nestjs/axios'
import { AuthServerHttpService } from './auth-server/auth-server-http.service'
import { AuthServerAuthController } from './auth-server/controllers/auth.controller'
import { AuthServerUserController } from './auth-server/controllers/user.controller'
import { EventServerEventController } from './event-server/controllers/event.controller'
import { EventServerRewardController } from './event-server/controllers/reward.controller'
import { EventServerHttpService } from './event-server/event-server-http.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [
    AuthServerAuthController,
    AuthServerUserController,
    EventServerEventController,
    EventServerRewardController,
  ],
  providers: [JwtStrategy, AuthServerHttpService, EventServerHttpService],
  exports: [AuthServerHttpService, EventServerHttpService],
})
export class GatewayModule {}
