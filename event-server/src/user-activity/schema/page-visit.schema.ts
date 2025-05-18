import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema({ timestamps: true, id: true })
export class PageVisit {
  id!: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId!: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, type: [String], default: [] })
  visitedPages!: string[]

  createdAt!: Date

  updatedAt!: Date
}

export const PageVisitSchema = SchemaFactory.createForClass(PageVisit)
