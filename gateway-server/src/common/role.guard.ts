import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RoleEnum } from 'src/gateway/auth-server/auth-server.enum'

export const Roles = (...roles: RoleEnum[]) => SetMetadata('ROLES_GUARD', roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleEnum[]>(
      'ROLES_GUARD',
      context.getHandler(),
    )

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const userRole: string = request.user.role

    if (!roles.includes(userRole as RoleEnum)) {
      throw new ForbiddenException('User role is not authorized')
    }

    return true
  }
}
