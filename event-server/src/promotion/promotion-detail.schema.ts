import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export class PromotionRequirement {
  specificAttendanceDates?: string[]
  accumulatedAttendanceDays?: number
  accumulatedPcRoomTime?: number
  todayPcRoomTime?: number
  accumulatedPurchaseAmount?: number
  specificPageAccess?: string
}

export class PromotionReward {
  rewardId: string
  count?: number
  amount?: number
}

@Schema({
  timestamps: true,
  id: true,
  strictQuery: false,
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      delete ret._id
    },
  },
})
export class PromotionDetail {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  promotionId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: PromotionReward })
  reward!: PromotionReward

  @Prop({ required: true, type: PromotionRequirement })
  option!: PromotionRequirement

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ required: true, type: Number })
  rewardCount!: number

  createdAt!: Date

  updatedAt!: Date
}

export const PromotionDetailSchema =
  SchemaFactory.createForClass(PromotionDetail)
