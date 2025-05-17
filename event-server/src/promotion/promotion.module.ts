import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Promotion, PromotionSchema } from './promotion.schema'
import {
  PromotionDetail,
  PromotionDetailSchema,
} from './promotion-detail.schema'
import { PromotionController } from './promotion.controller'
import { PromotionService } from './promotion.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
      { name: PromotionDetail.name, schema: PromotionDetailSchema },
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
