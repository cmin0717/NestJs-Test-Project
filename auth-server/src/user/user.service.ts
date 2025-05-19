import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  RoleDto,
  SignupDto,
  UserCouponDto,
  UserItemDto,
  UserCashDto,
} from './dto/user.dto'
import { hashSHA256 } from 'src/common/util'
import { RoleEnum } from './enum/user.enum'
import { UserRequestSuccessHistory } from './schema/user-request-success-history.schema'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(UserRequestSuccessHistory.name)
    private userRequestSuccessHistoryModel: Model<UserRequestSuccessHistory>,
  ) {}

  async findOneByUserId(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    return user
  }

  async findOneByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await hashSHA256(password)
    const user = await this.userModel.findOne({ email, hashedPassword }).exec()

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    return user
  }

  async signup(signupDto: SignupDto): Promise<User> {
    const user = await this.userModel.findOne({ email: signupDto.email }).exec()

    if (user) {
      throw new BadRequestException('User already exists')
    }

    const hashedPassword = await hashSHA256(signupDto.password)
    const newUserForm = new this.userModel({
      email: signupDto.email,
      hashedPassword,
      role: signupDto.role,
    })

    return await newUserForm.save()
  }

  async updateUserRole(userId: string, roleDto: RoleDto): Promise<User> {
    const user = await this.findOneByUserId(userId)

    if (user.role !== RoleEnum.ADMIN) {
      throw new BadRequestException('User is not admin')
    }

    const { targetUserId, role } = roleDto
    const targetUser = await this.userModel.findByIdAndUpdate(targetUserId, {
      $set: { role },
    })

    if (!targetUser) {
      throw new BadRequestException('Target user not found')
    }

    return targetUser
  }

  async getUserRequestSuccessHistory(
    userId: string,
    eventDetailId: string,
  ): Promise<UserRequestSuccessHistory | null> {
    return await this.userRequestSuccessHistoryModel
      .findOne({ userId, eventDetailId })
      .exec()
  }

  async updateUserCash(userId: string, cashDto: UserCashDto): Promise<void> {
    const { amount, eventDetailId } = cashDto
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { cash: amount },
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new BadRequestException('User not found')
    }

    await this.userRequestSuccessHistoryModel.create({
      userId,
      eventDetailId,
    })
  }

  async updateUserItem(userId: string, itemDto: UserItemDto): Promise<void> {
    const { name, amount, eventDetailId } = itemDto
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { items: { name, amount } },
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new BadRequestException('User not found')
    }

    await this.userRequestSuccessHistoryModel.create({
      userId,
      eventDetailId,
    })
  }

  async updateUserCoupon(
    userId: string,
    couponDto: UserCouponDto,
  ): Promise<void> {
    const { name, amount, eventDetailId } = couponDto
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { coupons: { name, amount } },
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new BadRequestException('User not found')
    }

    await this.userRequestSuccessHistoryModel.create({
      userId,
      eventDetailId,
    })
  }
}
