import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export enum RoleEnum {
  USER = 'user',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  AUDITOR = 'auditor',
}

@Schema({
  timestamps: true,
  id: true,
  strictQuery: false,
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (_doc: any, ret: any) => {
      delete ret._id
      delete ret.password
    },
  },
})
export class User extends mongoose.Document {
  id!: string

  @Prop({ required: true, unique: true, index: true })
  email!: string

  @Prop({ required: true })
  password!: string

  @Prop({
    required: true,
    type: String,
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role!: RoleEnum

  createdAt!: Date

  updatedAt!: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ email: 1 }, { unique: true })
