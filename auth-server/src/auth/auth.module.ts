import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: 'maple_story_jwt_secret',
          signOptions: { expiresIn: '1d' },
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
