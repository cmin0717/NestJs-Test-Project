import { Test, TestingModule } from '@nestjs/testing'
import { UserActivityService } from './user-activity.service'
import { getModelToken } from '@nestjs/mongoose'
import { DailyMonsterKill } from './schema/daily-monster-kill.schema'
import { AccessGameInformation } from './schema/access-game-information.schema'
import { PurchaseHistory } from './schema/purchase-history.schema'
import { PageVisit } from './schema/page-visit.schema'

describe('이벤트 검증 로직 테스트', () => {
  let service: UserActivityService

  const fakeDailyMonsterKillModel = {
    findOne: jest.fn(),
  }

  const fakeAccessGameInformationModel = {
    find: jest.fn(),
    findOne: jest.fn(),
  }

  const fakePurchaseHistoryModel = {
    find: jest.fn(),
  }

  const fakePageVisitModel = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserActivityService,
        {
          provide: getModelToken(DailyMonsterKill.name),
          useValue: fakeDailyMonsterKillModel,
        },
        {
          provide: getModelToken(AccessGameInformation.name),
          useValue: fakeAccessGameInformationModel,
        },
        {
          provide: getModelToken(PurchaseHistory.name),
          useValue: fakePurchaseHistoryModel,
        },
        {
          provide: getModelToken(PageVisit.name),
          useValue: fakePageVisitModel,
        },
      ],
    }).compile()

    service = module.get<UserActivityService>(UserActivityService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('검증 로직 테스트[Access Game Information]', () => {
    const mockUserId = 'mockUserId'
    const mockStartDate = new Date('2025-05-01')
    const mockEndDate = new Date('2025-05-30')

    describe('단일 출석일 검증', () => {
      it('성공 케이스', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
          },
        ])

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            specificAttendanceDates: ['2025-05-03'],
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              specificAttendanceDates: ['2025-05-05'],
            },
          )
        } catch (error) {
          expect(error.message).toBe('특정 출석일 요구사항을 만족하지 않습니다')
        }
      })
    })

    describe('여러 출석일 검증', () => {
      it('성공 케이스', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
          },
          {
            dateString: '2025-05-04',
          },
          {
            dateString: '2025-05-05',
          },
        ])

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            specificAttendanceDates: ['2025-05-03', '2025-05-04', '2025-05-05'],
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
          },
          {
            dateString: '2025-05-05',
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              specificAttendanceDates: ['2025-05-03', '2025-05-04'],
            },
          )
        } catch (error) {
          expect(error.message).toBe('특정 출석일 요구사항을 만족하지 않습니다')
        }
      })
    })

    describe('누적 출석일 검증', () => {
      it('성공 케이스', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-01',
          },
          {
            dateString: '2025-05-04',
          },
          {
            dateString: '2025-05-30',
          },
        ])

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            accumulatedAttendanceDays: 3,
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스[누적 출석일 부족]', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
          },
          {
            dateString: '2025-05-05',
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              accumulatedAttendanceDays: 3,
            },
          )
        } catch (error) {
          expect(error.message).toBe('누적 출석일 요구사항을 만족하지 않습니다')
        }
      })

      it('실패 케이스[이벤트 기간 외 출석일 체크]', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-04-03',
          },
          {
            dateString: '2025-04-04',
          },
          {
            dateString: '2025-05-03',
          },
          {
            dateString: '2025-05-05',
          },
          {
            dateString: '2025-05-31',
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              accumulatedAttendanceDays: 3,
            },
          )
        } catch (error) {
          expect(error.message).toBe('누적 출석일 요구사항을 만족하지 않습니다')
        }
      })
    })

    describe('누적 PC방 이용시간 검증', () => {
      it('성공 케이스[여러일 이용시간 검증]', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
            dailyPcRoomAccumulatedTime: 60,
          },
          {
            dateString: '2025-05-04',
            dailyPcRoomAccumulatedTime: 60,
          },
          {
            dateString: '2025-05-05',
            dailyPcRoomAccumulatedTime: 60,
          },
        ])

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            accumulatedPcRoomTime: 180,
          },
        )
        expect(result).toBeUndefined()
      })

      it('성공 케이스[당일 이용시간 검증]', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-14',
            dailyPcRoomAccumulatedTime: 180,
          },
        ])

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            accumulatedPcRoomTime: 180,
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스[이용시간 미달]', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
            dailyPcRoomAccumulatedTime: 60,
          },
          {
            dateString: '2025-05-05',
            dailyPcRoomAccumulatedTime: 59,
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              accumulatedPcRoomTime: 120,
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '누적 PC방 이용시간 요구사항을 만족하지 않습니다',
          )
        }
      })

      it('실패 케이스[이벤트 기간 외 이용시간 체크]', async () => {
        fakeAccessGameInformationModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-04-03',
            dailyPcRoomAccumulatedTime: 60,
          },
          {
            dateString: '2025-04-04',
            dailyPcRoomAccumulatedTime: 60,
          },
          {
            dateString: '2025-05-03',
            dailyPcRoomAccumulatedTime: 60,
          },
          {
            dateString: '2025-05-05',
            dailyPcRoomAccumulatedTime: 60,
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              accumulatedPcRoomTime: 121,
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '누적 PC방 이용시간 요구사항을 만족하지 않습니다',
          )
        }
      })
    })

    describe('당일 PC방 이용시간 검증', () => {
      it('성공 케이스', async () => {
        fakeAccessGameInformationModel.findOne.mockResolvedValueOnce({
          dateString: '2025-05-03',
          dailyPcRoomAccumulatedTime: 60,
        })

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            dailyPcRoomTime: {
              dailyPcRoomTime: 60,
              attendanceDate: '2025-05-03',
            },
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스[이용시간 미달]', async () => {
        fakeAccessGameInformationModel.findOne.mockResolvedValueOnce({
          dateString: '2025-05-03',
          dailyPcRoomAccumulatedTime: 59,
        })

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              dailyPcRoomTime: {
                dailyPcRoomTime: 60,
                attendanceDate: '2025-05-03',
              },
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '당일 PC방 이용시간 요구사항을 만족하지 않습니다',
          )
        }
      })

      it('실패 케이스[이벤트 기간 외 이용시간 체크]', async () => {
        fakeAccessGameInformationModel.findOne.mockResolvedValueOnce({
          dateString: '2025-05-02',
          dailyPcRoomAccumulatedTime: 60,
        })

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              dailyPcRoomTime: {
                dailyPcRoomTime: 60,
                attendanceDate: '2025-05-03',
              },
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '당일 PC방 이용시간 요구사항을 만족하지 않습니다',
          )
        }
      })

      it('실패 케이스[디비 값이 없는 경우]', async () => {
        fakeAccessGameInformationModel.findOne.mockResolvedValueOnce(null)

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              dailyPcRoomTime: {
                dailyPcRoomTime: 60,
                attendanceDate: '2025-05-03',
              },
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '당일 PC방 이용시간 요구사항을 만족하지 않습니다',
          )
        }
      })
    })
  })

  describe('검증 로직 테스트[Purchase History]', () => {
    const mockUserId = 'mockUserId'
    const mockStartDate = new Date('2025-05-01')
    const mockEndDate = new Date('2025-05-30')

    describe('누적 캐시 충전 검증', () => {
      it('성공 케이스', async () => {
        fakePurchaseHistoryModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-01',
            amount: 10000,
          },
          {
            dateString: '2025-05-04',
            amount: 10000,
          },
          {
            dateString: '2025-05-30',
            amount: 10000,
          },
        ])

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            accumulatedPurchaseAmount: 30000,
          },
        )
        expect(result).toBeUndefined()
        expect(fakePurchaseHistoryModel.find).toHaveBeenCalledWith({
          userId: mockUserId,
          dateString: {
            $gte: '2025-05-01',
            $lte: '2025-05-30',
          },
          isPaid: true,
        })
      })

      it('실패 케이스[누적 캐시 충전 미달]', async () => {
        fakePurchaseHistoryModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-05-03',
            amount: 10000,
          },
          {
            dateString: '2025-05-04',
            amount: 10000,
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              accumulatedPurchaseAmount: 30000,
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '누적 캐시 충전 요구사항을 만족하지 않습니다',
          )
        }
      })

      it('실패 케이스[이벤트 기간 외 캐시 충전 체크]', async () => {
        fakePurchaseHistoryModel.find.mockResolvedValueOnce([
          {
            dateString: '2025-04-03',
            amount: 10000,
          },
          {
            dateString: '2025-05-04',
            amount: 10000,
          },
          {
            dateString: '2025-05-31',
            amount: 10000,
          },
        ])

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              accumulatedPurchaseAmount: 30000,
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '누적 캐시 충전 요구사항을 만족하지 않습니다',
          )
        }
      })
    })
  })

  describe('검증 로직 테스트[Page Visit]', () => {
    const mockUserId = 'mockUserId'
    const mockStartDate = new Date('2025-05-01')
    const mockEndDate = new Date('2025-05-30')

    describe('특정 페이지 방문 검증', () => {
      it('성공 케이스', async () => {
        fakePageVisitModel.findOne.mockResolvedValueOnce({
          visitedPages: ['https://www.nexon.com'],
        })

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            specificPageAccess: 'https://www.nexon.com',
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스[페이지 방문 미달]', async () => {
        fakePageVisitModel.findOne.mockResolvedValueOnce({
          visitedPages: ['https://www.naver.com'],
        })

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              specificPageAccess: 'https://www.nexon.com',
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '특정 페이지 방문 요구사항을 만족하지 않습니다',
          )
        }
      })

      it('실패 케이스[디비 값이 없는 경우]', async () => {
        fakePageVisitModel.findOne.mockResolvedValueOnce(null)

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              specificPageAccess: 'https://www.nexon.com',
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '특정 페이지 방문 요구사항을 만족하지 않습니다',
          )
        }
      })
    })
  })

  describe('검증 로직 테스트[Daily Monster Kill]', () => {
    const mockUserId = 'mockUserId'
    const mockStartDate = new Date('2025-05-01')
    const mockEndDate = new Date('2025-05-30')

    describe('당일 몬스터 처치 검증', () => {
      it('성공 케이스', async () => {
        fakeDailyMonsterKillModel.findOne.mockResolvedValueOnce({
          dateString: '2025-05-03',
          monsterKillCount: 100,
        })

        const result = await service.checkRewardEligibility(
          mockUserId,
          mockStartDate,
          mockEndDate,
          {
            dailyMonsterKillCount: {
              dailyMonsterKillCount: 100,
              attendanceDate: '2025-05-03',
            },
          },
        )
        expect(result).toBeUndefined()
      })

      it('실패 케이스[몬스터 처치 미달]', async () => {
        fakeDailyMonsterKillModel.findOne.mockResolvedValueOnce({
          dateString: '2025-05-03',
          monsterKillCount: 99,
        })

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              dailyMonsterKillCount: {
                dailyMonsterKillCount: 100,
                attendanceDate: '2025-05-03',
              },
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '당일 몬스터 처치 요구사항을 만족하지 않습니다',
          )
        }
      })

      it('실패 케이스[디비 값이 없는 경우]', async () => {
        fakeDailyMonsterKillModel.findOne.mockResolvedValueOnce(null)

        try {
          await service.checkRewardEligibility(
            mockUserId,
            mockStartDate,
            mockEndDate,
            {
              dailyMonsterKillCount: {
                dailyMonsterKillCount: 100,
                attendanceDate: '2025-05-03',
              },
            },
          )
        } catch (error) {
          expect(error.message).toBe(
            '당일 몬스터 처치 요구사항을 만족하지 않습니다',
          )
        }
      })
    })
  })
})
