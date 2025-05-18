import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true, id: true })
export class LoginInformation {
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
  dailyAccumulatedTime!: number

  @Prop({ required: true, type: Number, default: 0 })
  dailyPcRoomAccumulatedTime!: number

  @Prop({ required: true, type: Boolean, default: false })
  isPassTicket!: boolean

  createdAt!: Date

  updatedAt!: Date
}

export const LoginInformationSchema =
  SchemaFactory.createForClass(LoginInformation)
