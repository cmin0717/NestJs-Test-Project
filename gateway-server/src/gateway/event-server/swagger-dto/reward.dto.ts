import { ApiProperty } from '@nestjs/swagger'
import { RewardHistoryState, RewardType } from '../event-server.enum'

export class RewardFilterDto {
  @ApiProperty({
    description: '보상 타입 (CASH, ITEM, COUPON)',
    required: false,
    type: String,
    enum: RewardType,
  })
  type?: RewardType
}

export class RewardDto {
  @ApiProperty({
    description: '보상 제목',
    example: '보상 제목',
  })
  name!: string

  @ApiProperty({
    description: '보상 설명',
    example: '보상 설명',
  })
  description!: string

  @ApiProperty({
    description: '보상 타입 (CASH, ITEM, COUPON)',
    example: 'CASH',
  })
  type!: RewardType
}

export class RewardUpdateDto {
  @ApiProperty({
    description: '보상 제목',
    required: false,
    type: String,
    example: '보상 제목',
  })
  name?: string

  @ApiProperty({
    description: '보상 설명',
    required: false,
    type: String,
    example: '보상 설명',
  })
  description?: string

  @ApiProperty({
    description: '보상 타입 (CASH, ITEM, COUPON)',
    required: false,
    type: String,
    enum: RewardType,
    example: 'CASH',
  })
  type?: RewardType
}

export class RewardHistoryFilterDto {
  @ApiProperty({
    description: '이벤트 ID',
    required: false,
    type: String,
  })
  eventId?: string

  @ApiProperty({
    description: '이벤트 상세 ID',
    required: false,
    type: String,
  })
  eventDetailId?: string

  @ApiProperty({
    description: '보상 ID',
    required: false,
    type: String,
  })
  rewardId?: string

  @ApiProperty({
    description: '유저 ID',
    required: false,
    type: String,
  })
  userId?: string

  @ApiProperty({
    description: '보상 상태',
    required: false,
    enum: RewardHistoryState,
  })
  state?: RewardHistoryState

  @ApiProperty({
    description: '한번에 가져올 개수[기본값: 10]',
    required: false,
    type: String,
  })
  limit?: string

  @ApiProperty({
    description: '커서(id 기준)[기본값: null]',
    required: false,
    type: String,
  })
  cursorId?: string
}
