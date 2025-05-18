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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
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

  async updateUserCash(userId: string, cashDto: UserCashDto): Promise<void> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { cash: cashDto.amount },
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new BadRequestException('User not found')
    }
  }

  async updateUserItem(userId: string, itemDto: UserItemDto): Promise<void> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { items: itemDto },
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new BadRequestException('User not found')
    }
  }

  async updateUserCoupon(
    userId: string,
    couponDto: UserCouponDto,
  ): Promise<void> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { coupons: couponDto },
      },
      { new: true },
    )

    if (!updatedUser) {
      throw new BadRequestException('User not found')
    }
  }
}
