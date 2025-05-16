import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    // const user = plainToInstance(UserEntity, request.user)
    // validateSync(user)

    return request.user.id
  },
)
