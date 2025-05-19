import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUrl,
} from 'class-validator'

export class DailyMonsterKillDto {
  @IsDateString()
  dateString!: string
}

export class AccessGameInformationDto {
  @IsDateString()
  dateString!: string

  @IsBoolean()
  isPassTicket!: boolean
}

export class PurchaseHistoryDto {
  @IsNumber()
  amount!: number

  @IsBoolean()
  isPaid!: boolean
}

export class PageVisitDto {
  @IsUrl()
  visitedPageUrl!: string
}

export class UpdateDailyMonsterKillDto {
  @IsNumber()
  monsterKillCount!: number
}

export class UpdateAccessGameInformationDto {
  @IsNumber()
  @IsOptional()
  dailyAccumulatedTime?: number

  @IsNumber()
  @IsOptional()
  dailyPcRoomAccumulatedTime?: number
}
