import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true, id: true })
export class UserRequestSuccessHistory extends mongoose.Document {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  eventDetailId!: mongoose.Schema.Types.ObjectId

  createdAt!: Date

  updatedAt!: Date
}

export const UserRequestSuccessHistorySchema = SchemaFactory.createForClass(
  UserRequestSuccessHistory,
)
UserRequestSuccessHistorySchema.index(
  { userId: 1, eventDetailId: 1 },
  { unique: true },
)
