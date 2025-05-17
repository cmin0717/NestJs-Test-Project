import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { RewardService } from './reward.service'
import { RewardDto, RewardRequestDto, RewardUpdateDto } from './reward.dto'

@Controller({ path: 'reward' })
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('')
  async getRewards() {
    return this.rewardService.getRewards()
  }

  @Get(':rewardId')
  async getReward(@Param('rewardId') rewardId: string) {
    return this.rewardService.getReward(rewardId)
  }

  @Get('histories/:userId')
  async getRewardHistories(@Param('userId') userId: string) {
    return this.rewardService.getRewardHistories(userId)
  }

  @Post('')
  async createReward(@Body() rewardDto: RewardDto) {
    return this.rewardService.createReward(rewardDto)
  }

  @Post('request/:promotionDetailId')
  async requestReward(
    @Param('promotionDetailId') promotionDetailId: string,
    @Body() rewardRequestDto: RewardRequestDto,
  ) {
    return this.rewardService.requestReward(
      promotionDetailId,
      rewardRequestDto.userId,
    )
  }

  @Patch(':rewardId')
  async updateReward(
    @Param('rewardId') rewardId: string,
    @Body() rewardUpdateDto: RewardUpdateDto,
  ) {
    return this.rewardService.updateReward(rewardId, rewardUpdateDto)
  }
}
