import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { RewardType } from '../enum/reward.enum'

@Schema({ timestamps: true, id: true })
export class Reward {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  makerUserId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: String })
  name!: string

  @Prop({ required: true, enum: RewardType, type: String })
  type!: RewardType

  createdAt!: Date

  updatedAt!: Date
}

export const RewardSchema = SchemaFactory.createForClass(Reward)
