import { IsEmail, IsEnum, IsString } from 'class-validator'
import { RoleEnum } from './user.schema'

export class SignupDto {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}

export class RoleDto {
  @IsString()
  userId!: string

  @IsString()
  targetUserId!: string

  @IsEnum(RoleEnum)
  role!: RoleEnum
}
