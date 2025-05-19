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
import { ObjectIdPipe } from 'src/common/object-id-validator'
import { RewardType } from './enum/reward.enum'

@Controller({ path: 'reward' })
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('/')
  async getRewards(@Query('type') type?: RewardType) {
    return this.rewardService.getRewards(type)
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
    @Param('eventDetailId', ObjectIdPipe) eventDetailId: string,
  ) {
    return this.rewardService.requestReward(user.id, eventDetailId)
  }

  @Patch(':rewardId')
  async updateReward(
    @Param('rewardId', ObjectIdPipe) rewardId: string,
    @Body() rewardUpdateDto: RewardUpdateDto,
  ) {
    return this.rewardService.updateReward(rewardId, rewardUpdateDto)
  }
}
