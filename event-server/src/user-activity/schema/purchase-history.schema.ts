import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true, id: true })
export class PurchaseHistory {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: Number })
  amount!: number

  @Prop({ required: true, type: Boolean, default: true })
  isPaid!: boolean

  createdAt!: Date

  updatedAt!: Date
}

export const PurchaseHistorySchema =
  SchemaFactory.createForClass(PurchaseHistory)
