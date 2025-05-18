import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        // config 파일에서 가져오도록 수정
        return {
          secret: 'maple_story_jwt_secret',
          signOptions: { expiresIn: '1d' },
        }
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
