import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

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
export class DailyMonsterKill {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({
    required: true,
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/,
  })
  dateString!: string

  @Prop({ required: true, type: Number, default: 0 })
  monsterKillCount!: number

  createdAt!: Date

  updatedAt!: Date
}

export const DailyMonsterKillSchema =
  SchemaFactory.createForClass(DailyMonsterKill)
