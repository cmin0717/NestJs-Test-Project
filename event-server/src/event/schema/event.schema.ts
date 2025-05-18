import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true, id: true })
export class Event {
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

export const EventSchema = SchemaFactory.createForClass(Event)
