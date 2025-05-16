import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const Roles = (...roles: string[]) => SetMetadata('ROLES_GUARD', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // 가드에 Reflector를 주입

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      'ROLES_GUARD',
      context.getHandler(),
    )

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const userRole: string = request.user.role

    if (!roles.includes(userRole)) {
      throw new ForbiddenException('User role is not authorized')
    }

    return true
  }
}
