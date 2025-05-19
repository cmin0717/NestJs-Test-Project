import { ApiProperty } from '@nestjs/swagger'

class DailyPcRoomTimeRequirementDto {
  @ApiProperty({
    description: '일일 PC 방 시간(단위 분)',
    example: 180,
  })
  dailyPcRoomTime!: number

  @ApiProperty({
    description: '참여 날짜',
    example: '2025-05-22',
  })
  attendanceDate!: string
}

class DailyMonsterKillCountRequirementDto {
  @ApiProperty({
    description: '일일 몬스터 처치 수',
    example: 200,
  })
  dailyMonsterKillCount!: number

  @ApiProperty({
    description: '참여 날짜',
    example: '2025-05-22',
  })
  attendanceDate!: string
}

class EventRequirementDto {
  @ApiProperty({
    description: '이벤트 참여 날짜들',
    required: false,
    type: [String],
    example: ['2025-05-22', '2025-05-23'],
  })
  specificAttendanceDates?: string[]

  @ApiProperty({
    description: '누적 참여 일수',
    required: false,
    type: Number,
    example: 3,
  })
  accumulatedAttendanceDays?: number

  @ApiProperty({
    description: '누적 PC 방 시간(단위 분)',
    required: false,
    type: Number,
    example: 600,
  })
  accumulatedPcRoomTime?: number

  @ApiProperty({
    description: '일일 PC 방 시간(단위 분)',
    required: false,
    type: DailyPcRoomTimeRequirementDto,
    example: {
      dailyPcRoomTime: 180,
      attendanceDate: '2025-05-22',
    },
  })
  dailyPcRoomTime?: DailyPcRoomTimeRequirementDto

  @ApiProperty({
    description: '일일 몬스터 처치 수',
    required: false,
    type: DailyMonsterKillCountRequirementDto,
    example: {
      dailyMonsterKillCount: 200,
      attendanceDate: '2025-05-22',
    },
  })
  dailyMonsterKillCount?: DailyMonsterKillCountRequirementDto

  @ApiProperty({
    description: '누적 구매 금액(단위 원)',
    required: false,
    type: Number,
    example: 100000,
  })
  accumulatedPurchaseAmount?: number

  @ApiProperty({
    description: '특정 페이지 접근',
    required: false,
    type: String,
    example: 'https://maplestory.nexon.com/',
  })
  specificPageAccess?: string
}

class EventRewardDto {
  @ApiProperty({
    description: '보상 ID',
    example: '6829eefaf9215c45a216f29e',
  })
  rewardId!: string

  @ApiProperty({
    description: '보상 수량 or 금액',
    example: 100000,
  })
  amount!: number
}

export class EventDto {
  @ApiProperty({
    description: '이벤트 제목',
    example: '이벤트 제목',
  })
  title!: string

  @ApiProperty({
    description: '이벤트 설명',
    example: '이벤트 설명',
  })
  description!: string

  @ApiProperty({
    description: '이벤트 시작일',
    type: Date,
    example: new Date('2025-01-01'),
  })
  startDate!: Date

  @ApiProperty({
    description: '이벤트 종료일',
    type: Date,
    example: new Date('2025-12-31'),
  })
  endDate!: Date
}

export class EventDetailDto {
  @ApiProperty({
    description: '보상',
    type: EventRewardDto,
  })
  reward!: EventRewardDto

  @ApiProperty({
    description: '이벤트 요구 사항',
    type: EventRequirementDto,
  })
  eventRequirement!: EventRequirementDto

  @ApiProperty({
    description: '이벤트 설명',
    example: '이벤트 설명',
  })
  description!: string

  @ApiProperty({
    description: '지급 가능 남은 보상 개수',
    example: 10000,
  })
  availableRewardCount!: number
}

export class EventUpdateDto {
  @ApiProperty({
    description: '이벤트 제목',
    required: false,
    type: String,
    example: '이벤트 제목',
  })
  title?: string

  @ApiProperty({
    description: '이벤트 설명',
    required: false,
    type: String,
    example: '이벤트 설명',
  })
  description?: string

  @ApiProperty({
    description: '이벤트 시작일',
    required: false,
    type: Date,
    example: new Date('2025-01-01'),
  })
  startDate?: Date

  @ApiProperty({
    description: '이벤트 종료일',
    required: false,
    type: Date,
    example: new Date('2025-11-31'),
  })
  endDate?: Date

  @ApiProperty({
    description: '이벤트 활성화 여부',
    required: false,
    type: Boolean,
    example: true,
  })
  active?: boolean
}

export class EventDetailUpdateDto {
  @ApiProperty({
    description: '보상',
    required: false,
    type: EventRewardDto,
  })
  reward?: EventRewardDto

  @ApiProperty({
    description: '이벤트 요구 사항',
    required: false,
    type: EventRequirementDto,
  })
  eventRequirement?: EventRequirementDto

  @ApiProperty({
    description: '이벤트 설명',
    required: false,
    type: String,
  })
  description?: string

  @ApiProperty({
    description: '지급 가능 남은 보상 개수',
    required: false,
    type: Number,
  })
  availableRewardCount?: number
}
