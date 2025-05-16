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
