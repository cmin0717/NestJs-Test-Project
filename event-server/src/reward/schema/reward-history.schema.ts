import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { RewardHistoryState } from '../enum/reward-history.enum'

@Schema({ timestamps: true, id: true })
export class RewardHistory {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, index: true })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, index: true })
  eventId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, index: true })
  eventDetailId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, index: true })
  rewardId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: Number })
  amount!: number

  @Prop({ required: true, type: String, enum: RewardHistoryState, index: true })
  state!: RewardHistoryState

  createdAt!: Date

  updatedAt!: Date
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory)
