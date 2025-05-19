import { ApiProperty } from '@nestjs/swagger'
import { RewardType } from './gateway/event-server/event-server.enum'

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

export const MakeUserDataSet = [
  {
    email: 'admin@admin.com',
    password: '1234',
    role: 'ADMIN',
  },
  {
    email: 'operator@operator.com',
    password: '1234',
    role: 'OPERATOR',
  },
  {
    email: 'auditor@auditor.com',
    password: '1234',
    role: 'AUDITOR',
  },
  {
    email: 'user@user.com',
    password: '1234',
    role: 'USER',
  },
]

export const MakeRewardDataSet = [
  {
    name: '캐시 포인트',
    description: '유료 캐시 포인트와 같이 사용할 수 있는 포인트',
    type: RewardType.CASH,
  },
  {
    name: '노가다 목장갑',
    description: '레벨 제한 10, 물리 방어력 2, 직업 제한 없음',
    type: RewardType.ITEM,
  },
  {
    name: '붉은 채찍',
    description:
      '레벨 제한 35, 공격력 48, 이동속도 +15증가, 공격속도 빠름, 직업 제한 없음',
    type: RewardType.ITEM,
  },
  {
    name: '몽둥이',
    description: '레벨 제한 0, 공격력 19, 공격속도 빠름, 직업 제한 없음',
    type: RewardType.ITEM,
  },
  {
    name: '검',
    description: '레벨 제한 0, 공격력 17, 공격속도 빠름, 직업 제한 없음',
    type: RewardType.ITEM,
  },
  {
    name: '30분 경험치 2배 쿠폰',
    description: '30분 동안 사냥 획득 경험치가 2배로 증가하는 쿠폰',
    type: RewardType.ITEM,
  },
  {
    name: '캐시 20% 할인 쿠폰',
    description: '캐시 20% 할인 쿠폰(최대 10000원 할인)',
    type: RewardType.COUPON,
  },
]

// 캐시, 목장갑, 붉은채찍, 몽둥이, 검, 경험치2배, 캐시20할인
export const MakeEventDataSet = [
  {
    title: '출석 이벤트',
    description: '특정일 출석, 누적 출석시 아이템 지급 이벤트',
    startDate: new Date('2025-05-20'),
    endDate: new Date('2025-05-30'),
    eventDetails: [
      {
        reward: { index: 1, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: ['2025-05-20'],
        },
        description: '2025-05-20 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 1, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: ['2025-05-21'],
        },
        description: '2025-05-21 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 3, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: ['2025-05-22'],
        },
        description: '2025-05-22 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 4, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: ['2025-05-23'],
        },
        description: '2025-05-23 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 3, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: ['2025-05-24'],
        },
        description: '2025-05-24 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 4, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: ['2025-05-25'],
        },
        description: '2025-05-25 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 2, amount: 1 },
        eventRequirement: {
          specificAttendanceDates: [
            '2025-05-26',
            '2025-05-27',
            '2025-05-28',
            '2025-05-29',
            '2025-05-30',
          ],
        },
        description: '2025-05-26 ~ 2025-05-30 출석 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 2, amount: 1 },
        eventRequirement: {
          accumulatedAttendanceDays: 5,
        },
        description: '누적 5일 출석 시 아이템 지급',
        availableRewardCount: 10000,
      },
      {
        reward: { index: 2, amount: 1 },
        eventRequirement: {
          accumulatedAttendanceDays: 10,
        },
        description: '누적 10일 출석 시 아이템 지급',
        availableRewardCount: 10000,
      },
    ],
  },
  {
    title: 'PC방 이용 이벤트',
    description:
      '일일, 누적 PC방 이용 시간이 특정 조건에 맞을 시 아이템 지급 이벤트',
    startDate: new Date('2025-05-20'),
    endDate: new Date('2025-05-30'),
    eventDetails: [
      {
        reward: { index: 3, amount: 1 },
        eventRequirement: {
          dailyPcRoomTime: {
            dailyPcRoomTime: 60,
            attendanceDate: '2025-05-20',
          },
        },
        description: '2025-05-20 일일 PC방 이용 시간 60분 이상 시 아이템 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 4, amount: 1 },
        eventRequirement: {
          accumulatedPcRoomTime: 300,
        },
        description: '누적 PC방 이용 시간 300분 이상 시 아이템 지급',
        availableRewardCount: 10,
      },
    ],
  },
  {
    title: '몬스터 처치 이벤트',
    description: '특정일 몬스터 처치 수 이상 처치 시 경험치 쿠폰 지급 이벤트',
    startDate: new Date('2025-05-20'),
    endDate: new Date('2025-05-30'),
    eventDetails: [
      {
        reward: { index: 5, amount: 1 },
        eventRequirement: {
          dailyMonsterKillCount: {
            dailyMonsterKillCount: 100,
            attendanceDate: '2025-05-20',
          },
        },
        description:
          '2025-05-20 일일 몬스터 처치 수 100 이상 시 경험치 쿠폰 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 5, amount: 2 },
        eventRequirement: {
          dailyMonsterKillCount: {
            dailyMonsterKillCount: 200,
            attendanceDate: '2025-05-21',
          },
        },
        description:
          '2025-05-21 일일 몬스터 처치 수 200 이상 시 경험치 쿠폰 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 5, amount: 3 },
        eventRequirement: {
          dailyMonsterKillCount: {
            dailyMonsterKillCount: 300,
            attendanceDate: '2025-05-22',
          },
        },
        description:
          '2025-05-22 일일 몬스터 처치 수 300 이상 시 경험치 쿠폰 지급',
        availableRewardCount: 10,
      },
    ],
  },
  {
    title: '캐시 충전 이벤트',
    description:
      '이벤트 기간 동안 누적 캐시가 특정 금액 이상시 포인트 지급 이벤트',
    startDate: new Date('2025-05-20'),
    endDate: new Date('2025-05-30'),
    eventDetails: [
      {
        reward: { index: 0, amount: 3000 },
        eventRequirement: {
          accumulatedPurchaseAmount: 100000,
        },
        description: '누적 캐시 100000원 이상 시 포인트 지급',
        availableRewardCount: 10,
      },
      {
        reward: { index: 0, amount: 5000 },
        eventRequirement: {
          accumulatedPurchaseAmount: 200000,
        },
        description: '누적 캐시 200000원 이상 시 포인트 지급',
        availableRewardCount: 10,
      },
    ],
  },
  {
    title: '페이지 방문 이벤트',
    description: '특정 페이지 방문시 쿠폰 지급 이벤트',
    startDate: new Date('2025-05-20'),
    endDate: new Date('2025-05-30'),
    eventDetails: [
      {
        reward: { index: 6, amount: 1 },
        eventRequirement: {
          specificPageAccess: 'https://www.nexon.com',
        },
        description: '넥슨 페이지 방문 시 쿠폰 지급',
        availableRewardCount: 10,
      },
    ],
  },
]
