import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User, UserSchema } from './schema/user.schema'
import {
  UserRequestSuccessHistory,
  UserRequestSuccessHistorySchema,
} from './schema/user-request-success-history.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: UserRequestSuccessHistory.name,
        schema: UserRequestSuccessHistorySchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
