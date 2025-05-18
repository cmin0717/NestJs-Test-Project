import { IsEnum, IsOptional, IsString } from 'class-validator'
import { RewardType } from '../enum/reward.enum'
import { RewardHistoryState } from '../enum/reward-history.enum'
import { IsObjectId } from 'src/common/object-id-validator'

export class RewardDto {
  @IsString()
  name!: string

  @IsString()
  description!: string

  @IsEnum(RewardType)
  type!: RewardType
}

export class RewardUpdateDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(RewardType)
  @IsOptional()
  type?: RewardType
}

export class RewardHistoryFilterDto {
  @IsObjectId()
  @IsOptional()
  eventId?: string

  @IsObjectId()
  @IsOptional()
  eventDetailId?: string

  @IsObjectId()
  @IsOptional()
  rewardId?: string

  @IsObjectId()
  @IsOptional()
  userId?: string

  @IsEnum(RewardHistoryState)
  @IsOptional()
  state?: RewardHistoryState

  @IsObjectId()
  @IsOptional()
  cursorId?: string
}
