import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export enum RewardType {
  CASH = 'CASH',
  ITEM = 'ITEM',
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
export class Reward {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  makerUserId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ required: true, type: RewardType })
  type!: RewardType

  createdAt!: Date

  updatedAt!: Date
}

export const RewardSchema = SchemaFactory.createForClass(Reward)
