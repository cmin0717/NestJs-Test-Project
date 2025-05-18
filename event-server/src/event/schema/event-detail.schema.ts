import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { EventRequirementDto, EventRewardDto } from '../dto/event.dto'

@Schema({ timestamps: true, id: true })
export class EventDetail {
  id!: string

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  })
  eventId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: EventRewardDto })
  reward!: EventRewardDto

  @Prop({ required: true, type: EventRequirementDto })
  eventRequirement!: EventRequirementDto

  @Prop({ required: true, type: String })
  description!: string

  @Prop({ required: true, type: Number, min: 0 })
  availableRewardCount!: number

  createdAt!: Date

  updatedAt!: Date
}

export const EventDetailSchema = SchemaFactory.createForClass(EventDetail)
