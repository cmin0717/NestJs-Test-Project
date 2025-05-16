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
export class Promotion {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  makerUserId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: String })
  title!: string

  @Prop({ required: true, type: Date })
  startDate!: Date

  @Prop({ required: true, type: Date })
  endDate!: Date

  @Prop({ required: true, type: Boolean, default: true })
  active!: boolean

  createdAt!: Date

  updatedAt!: Date
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion)
