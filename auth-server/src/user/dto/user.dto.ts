import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { RoleEnum } from '../enum/user.enum'
import { IsObjectId } from 'src/common/object-id-validator'

export class SignupDto {
  @IsEmail()
  email!: string

  @IsString()
  password!: string

  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum
}

export class RoleDto {
  @IsObjectId()
  targetUserId!: string

  @IsEnum(RoleEnum)
  role!: RoleEnum
}

export class UserItemDto {
  @IsObjectId()
  eventDetailId!: string

  @IsString()
  name!: string

  @IsNumber()
  amount!: number
}

export class UserCouponDto {
  @IsObjectId()
  eventDetailId!: string

  @IsString()
  name!: string

  @IsNumber()
  amount!: number
}

export class UserCashDto {
  @IsObjectId()
  eventDetailId!: string

  @IsNumber()
  amount!: number
}
