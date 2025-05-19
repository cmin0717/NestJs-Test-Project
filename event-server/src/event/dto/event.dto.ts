import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'
import { IsObjectId } from '../../common/object-id-validator'
import { subHours } from 'date-fns'

function transformDate(value: any) {
  return value instanceof Date
    ? subHours(value, 9)
    : subHours(new Date(value), 9)
}

export class EventDto {
  @IsString()
  title!: string

  @IsString()
  description!: string

  @Transform(transformDate)
  @IsDate()
  startDate!: Date

  @Transform(transformDate)
  @IsDate()
  endDate!: Date
}

export class DailyPcRoomTimeRequirementDto {
  @IsNumber()
  dailyPcRoomTime!: number

  @IsString()
  attendanceDate!: string
}

export class DailyMonsterKillCountRequirementDto {
  @IsNumber()
  dailyMonsterKillCount!: number

  @IsString()
  attendanceDate!: string
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

  @IsObject()
  @ValidateNested()
  @Type(() => DailyPcRoomTimeRequirementDto)
  @IsOptional()
  dailyPcRoomTime?: DailyPcRoomTimeRequirementDto

  @IsObject()
  @ValidateNested()
  @Type(() => DailyMonsterKillCountRequirementDto)
  @IsOptional()
  dailyMonsterKillCount?: DailyMonsterKillCountRequirementDto

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
