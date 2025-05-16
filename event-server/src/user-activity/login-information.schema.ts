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

  // 로그인시 참조 시간 변경
  @Prop({ required: true, type: Date })
  referenceTime!: Date

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
