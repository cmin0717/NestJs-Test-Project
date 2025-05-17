import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { RewardRequestHistoryRewardDto } from './reward.dto'

export enum RewardHistoryState {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  PROMOTION_UPDATED = 'PROMOTION_UPDATED',
  REWARD_PROVIDED = 'REWARD_PROVIDED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  JOB_FAILED = 'JOB_FAILED',
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
export class RewardRequestHistory {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  promotionId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  promotionDetailId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: RewardRequestHistoryRewardDto })
  reward!: RewardRequestHistoryRewardDto

  @Prop({
    required: true,
    type: [String],
    enum: RewardHistoryState,
    default: [RewardHistoryState.PENDING],
  })
  states!: RewardHistoryState[]

  @Prop({ required: true, type: Boolean, default: false })
  isCompleted!: boolean

  createdAt!: Date

  updatedAt!: Date
}

export const RewardRequestHistorySchema =
  SchemaFactory.createForClass(RewardRequestHistory)
