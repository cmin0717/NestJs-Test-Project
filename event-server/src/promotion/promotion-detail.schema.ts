import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { PromotionRequirementDto, PromotionRewardDto } from './promotion.dto'

@Schema({
  timestamps: true,
  id: true,
  strictQuery: false,
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      ret.id = ret._id.toString()
      delete ret._id
    },
  },
})
export class PromotionDetail {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  promotionId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: PromotionRewardDto })
  reward!: PromotionRewardDto

  @Prop({ required: true, type: PromotionRequirementDto })
  option!: PromotionRequirementDto

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ required: true, type: Number, min: 0 })
  rewardCount!: number

  createdAt!: Date

  updatedAt!: Date
}

export const PromotionDetailSchema =
  SchemaFactory.createForClass(PromotionDetail)
