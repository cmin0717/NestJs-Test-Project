import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { PromotionService } from './promotion.service'
import {
  PromotionDetailDto,
  PromotionDetailUpdateDto,
  PromotionDto,
  PromotionUpdateDto,
} from './promotion.dto'

@Controller({ path: 'promotion' })
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('')
  async getPromotions() {
    return this.promotionService.getPromotions()
  }

  @Get('with-detail/:promotionId')
  async getPromotionWithDetail(@Param('promotionId') promotionId: string) {
    return this.promotionService.getPromotionWithDetail(promotionId)
  }

  @Post('')
  async createPromotion(@Body() promotionDto: PromotionDto) {
    return this.promotionService.createPromotion(promotionDto)
  }

  @Post('detail/:promotionId')
  async createPromotionDetail(
    @Param('promotionId') promotionId: string,
    @Body() promotionDetailDto: PromotionDetailDto,
  ) {
    return this.promotionService.createPromotionDetail(
      promotionId,
      promotionDetailDto,
    )
  }

  @Patch(':promotionId')
  async updatePromotion(
    @Param('promotionId') promotionId: string,
    @Body() promotionUpdateDto: PromotionUpdateDto,
  ) {
    return this.promotionService.updatePromotion(
      promotionId,
      promotionUpdateDto,
    )
  }

  @Patch('detail/:promotionDetailId')
  async updatePromotionDetail(
    @Param('promotionDetailId') promotionDetailId: string,
    @Body() promotionDetailUpdateDto: PromotionDetailUpdateDto,
  ) {
    return this.promotionService.updatePromotionDetail(
      promotionDetailId,
      promotionDetailUpdateDto,
    )
  }
}
