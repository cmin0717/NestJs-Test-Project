import { ApiProperty } from '@nestjs/swagger'

export class DailyMonsterKillDto {
  @ApiProperty({
    description: '기준 날짜',
    example: '2021-01-01',
  })
  dateString!: string
}

export class AccessGameInformationDto {
  @ApiProperty({
    description: '기준 날짜',
    example: '2021-01-01',
  })
  dateString!: string

  @ApiProperty({
    description: '패스권 사용 여부',
    example: true,
  })
  isPassTicket!: boolean
}

export class PurchaseHistoryDto {
  @ApiProperty({
    description: '결제 금액(단위 원)',
    example: 10000,
  })
  amount!: number

  @ApiProperty({
    description: '유료 캐시 여부',
    example: true,
  })
  isPaid!: boolean
}

export class PageVisitDto {
  @ApiProperty({
    description: '방문한 페이지 URL',
    example: 'https://www.nexon.com',
  })
  visitedPageUrl!: string
}

export class UpdateDailyMonsterKillDto {
  @ApiProperty({
    description: '몬스터 처치 횟수',
    example: 100,
  })
  monsterKillCount!: number
}

export class UpdateAccessGameInformationDto {
  @ApiProperty({
    description: '일일 누적 시간(단위 분)',
    example: 100,
    required: false,
  })
  dailyAccumulatedTime?: number

  @ApiProperty({
    description: '일일 PC 방 누적 시간(단위 분)',
    example: 100,
    required: false,
  })
  dailyPcRoomAccumulatedTime?: number
}
