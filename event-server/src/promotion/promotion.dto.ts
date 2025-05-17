import { Type } from 'class-transformer'
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'

export class PromotionDto {
  @IsString()
  makerUserId!: string

  @IsString()
  title!: string

  @IsString()
  description!: string

  @IsDate()
  startDate!: Date

  @IsDate()
  endDate!: Date
}

export class PromotionRequirementDto {
  @IsString({ each: true })
  @IsOptional()
  specificAttendanceDates?: string[]

  @IsNumber()
  @IsOptional()
  accumulatedAttendanceDays?: number

  @IsNumber()
  @IsOptional()
  accumulatedPcRoomTime?: number

  @IsNumber()
  @IsOptional()
  todayPcRoomTime?: number

  @IsNumber()
  @IsOptional()
  accumulatedPurchaseAmount?: number

  @IsUrl()
  @IsOptional()
  specificPageAccess?: string
}

export class PromotionRewardDto {
  @IsString()
  rewardId!: string

  @IsNumber()
  @IsOptional()
  count?: number

  @IsNumber()
  @IsOptional()
  amount?: number
}

export class PromotionDetailDto {
  @IsString()
  makerUserId!: string

  @IsObject()
  @ValidateNested()
  @Type(() => PromotionRewardDto)
  reward!: PromotionRewardDto

  @IsObject()
  @ValidateNested()
  @Type(() => PromotionRequirementDto)
  option!: PromotionRequirementDto

  @IsString()
  description!: string

  @IsNumber()
  rewardCount!: number
}

export class PromotionUpdateDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsDate()
  @IsOptional()
  startDate?: Date

  @IsDate()
  @IsOptional()
  endDate?: Date
}

export class PromotionDetailUpdateDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PromotionRewardDto)
  @IsOptional()
  reward?: PromotionRewardDto

  @IsObject()
  @ValidateNested()
  @Type(() => PromotionRequirementDto)
  @IsOptional()
  option?: PromotionRequirementDto

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsOptional()
  rewardCount?: number
}
