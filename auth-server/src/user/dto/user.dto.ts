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
  @IsString()
  name!: string

  @IsNumber()
  amount!: number

  @IsObjectId()
  eventDetailId!: string
}

export class UserCouponDto {
  @IsString()
  name!: string

  @IsNumber()
  amount!: number

  @IsObjectId()
  eventDetailId!: string
}

export class UserCashDto {
  @IsNumber()
  amount!: number

  @IsObjectId()
  eventDetailId!: string
}
