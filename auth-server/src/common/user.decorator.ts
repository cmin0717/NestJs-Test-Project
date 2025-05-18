import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsString, validateSync } from 'class-validator'
import { IsObjectId } from './object-id-validator'

export class RequestUserData {
  @IsObjectId()
  @IsNotEmpty()
  id!: string

  @IsString()
  @IsNotEmpty()
  role!: string
}

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const reqUserData = request.headers['x-user-data']

    const userData = plainToInstance(RequestUserData, JSON.parse(reqUserData))
    validateSync(userData)

    return userData
  },
)
