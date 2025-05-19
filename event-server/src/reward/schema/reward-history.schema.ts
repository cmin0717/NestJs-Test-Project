import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { RewardHistoryState } from '../enum/reward-history.enum'

@Schema({ timestamps: true, id: true })
export class RewardHistory {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  eventId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  eventDetailId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  rewardId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: Number })
  amount!: number

  @Prop({ required: true, type: String, enum: RewardHistoryState })
  state!: RewardHistoryState

  createdAt!: Date

  updatedAt!: Date
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory)
RewardHistorySchema.index({ userId: 1, eventDetailId: 1 })
