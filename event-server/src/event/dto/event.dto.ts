import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'
import { IsObjectId } from 'src/common/object-id-validator'

export class EventDto {
  @IsString()
  title!: string

  @IsString()
  description!: string

  @IsDateString()
  startDate!: Date

  @IsDateString()
  endDate!: Date
}

export class EventRequirementDto {
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
  dailyPcRoomTime?: number

  @IsNumber()
  @IsOptional()
  dailyMonsterKillCount?: number

  @IsNumber()
  @IsOptional()
  accumulatedPurchaseAmount?: number

  @IsUrl()
  @IsOptional()
  specificPageAccess?: string
}

export class EventRewardDto {
  @IsObjectId()
  rewardId!: string

  @IsNumber()
  amount!: number
}

export class EventDetailDto {
  @IsObject()
  @ValidateNested()
  @Type(() => EventRewardDto)
  reward!: EventRewardDto

  @IsObject()
  @ValidateNested()
  @Type(() => EventRequirementDto)
  eventRequirement!: EventRequirementDto

  @IsString()
  description!: string

  @IsNumber()
  availableRewardCount!: number
}

export class EventUpdateDto {
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

  @IsBoolean()
  @IsOptional()
  active?: boolean
}

export class EventDetailUpdateDto {
  @IsObject()
  @ValidateNested()
  @Type(() => EventRewardDto)
  @IsOptional()
  reward?: EventRewardDto

  @IsObject()
  @ValidateNested()
  @Type(() => EventRequirementDto)
  @IsOptional()
  eventRequirement?: EventRequirementDto

  @IsString()
  @IsOptional()
  description?: string

  @IsNumber()
  @IsOptional()
  rewardCount?: number
}
