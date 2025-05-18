import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator'
import { RoleEnum } from '../enum/user.enum'
import { IsObjectId } from 'src/common/object-id-validator'

export class SignupDto {
  @IsEmail()
  email!: string

  @IsString()
  password!: string
}

export class RoleDto {
  @IsObjectId()
  targetUserId!: string

  @IsEnum(RoleEnum)
  role!: RoleEnum
}

export class UserItemDto {
  @IsString()
  name!: string

  @IsNumber()
  amount!: number
}

export class UserCouponDto {
  @IsString()
  name!: string

  @IsNumber()
  amount!: number
}

export class UserCashDto {
  @IsNumber()
  amount!: number
}
