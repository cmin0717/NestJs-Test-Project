import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator'
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

export class CashDto {
  @IsString()
  userId!: string

  @IsNumber()
  cash!: number
}

export class ItemDto {
  @IsString()
  userId!: string

  @IsString()
  item!: string
}
