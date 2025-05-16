import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AuthHttpService } from './auth-server/auth-http.service'

@Module({
  imports: [
    HttpModule.register({
      timeout: 60000,
    }),
  ],
  controllers: [],
  providers: [AuthHttpService],
  exports: [AuthHttpService],
})
export class RoutingModule {}
