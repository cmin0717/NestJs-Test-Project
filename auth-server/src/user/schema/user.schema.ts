import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { RoleEnum } from '../enum/user.enum'
import { UserCouponDto, UserItemDto } from '../dto/user.dto'

@Schema({
  timestamps: true,
  id: true,
})
export class User extends mongoose.Document {
  id!: string

  @Prop({ required: true, unique: true, index: true })
  email!: string

  @Prop({ required: true })
  hashedPassword!: string

  @Prop({
    required: true,
    type: String,
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role!: RoleEnum

  @Prop({ required: true, type: Number, default: 0, min: 0 })
  cash!: number

  @Prop({ required: true, type: [UserItemDto], default: [] })
  items!: UserItemDto[]

  @Prop({ required: true, type: [UserCouponDto], default: [] })
  coupons!: UserCouponDto[]

  createdAt!: Date

  updatedAt!: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.index({ email: 1 }, { unique: true })
