import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { RewardType } from './reward.schema'

export class RewardDto {
  @IsString()
  makerUserId!: string

  @IsString()
  title!: string

  @IsString()
  description!: string

  @IsEnum(RewardType)
  type!: RewardType
}

export class RewardUpdateDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(RewardType)
  @IsOptional()
  type?: RewardType
}

export class RewardRequestHistoryRewardDto {
  @IsString()
  rewardId!: string

  @IsString()
  rewardTitle!: string

  @IsString()
  rewardType!: string

  @IsNumber()
  @IsOptional()
  count?: number

  @IsNumber()
  @IsOptional()
  amount?: number
}

export class RewardRequestDto {
  @IsString()
  userId!: string
}
