import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { RewardService } from './reward.service'
import {
  RewardDto,
  RewardHistoryFilterDto,
  RewardUpdateDto,
} from './dto/reward.dto'
import { RequestUser, RequestUserData } from 'src/common/user.decorator'
import { IsObjectIdPipe } from '@nestjs/mongoose'

@Controller({ path: 'reward' })
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('/')
  async getRewards() {
    return this.rewardService.getRewards()
  }

  @Get('/histories')
  async getRewardHistories(
    @RequestUser() user: RequestUserData,
    @Query() rewardHistoryFilterDto: RewardHistoryFilterDto,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    return this.rewardService.getRewardHistories(
      {
        ...rewardHistoryFilterDto,
        userId: user.id,
      },
      limit,
    )
  }

  @Get('histories/admin')
  async getRewardHistoriesAdmin(
    @Query() rewardHistoryFilterDto: RewardHistoryFilterDto,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    return this.rewardService.getRewardHistories(
      {
        ...rewardHistoryFilterDto,
      },
      limit,
    )
  }

  @Post('')
  async createReward(
    @RequestUser() user: RequestUserData,
    @Body() rewardDto: RewardDto,
  ) {
    return this.rewardService.createReward(user.id, rewardDto)
  }

  @Post('request/:eventDetailId')
  async requestReward(
    @RequestUser() user: RequestUserData,
    @Param('eventDetailId') eventDetailId: string,
  ) {
    return this.rewardService.requestReward(user.id, eventDetailId)
  }

  @Patch(':rewardId')
  async updateReward(
    @Param('rewardId', IsObjectIdPipe) rewardId: string,
    @Body() rewardUpdateDto: RewardUpdateDto,
  ) {
    return this.rewardService.updateReward(rewardId, rewardUpdateDto)
  }
}
