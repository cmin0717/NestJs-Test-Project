import { BadRequestException, Injectable } from '@nestjs/common'
import { RoleEnum, User } from './user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CashDto, ItemDto, RoleDto, SignupDto } from './user.dto'
import { hashSHA256 } from 'src/common/util'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findOneByUserId(userId: string) {
    const user = await this.userModel.findById(userId).exec()

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    return user.toJSON()
  }

  async signup(signupDto: SignupDto) {
    const user = await this.userModel.findOne({ email: signupDto.email }).exec()

    if (user) {
      throw new BadRequestException('User already exists')
    }

    const newUserForm = new this.userModel({
      ...signupDto,
      password: await hashSHA256(signupDto.password),
    })
    const newUser = await newUserForm.save()

    return newUser.toJSON()
  }

  async updateUserRole(roleDto: RoleDto) {
    const user = await this.findOneByUserId(roleDto.userId)

    if (user.role !== RoleEnum.ADMIN) {
      throw new BadRequestException('User is not admin')
    }

    const targetUser = await this.userModel.findByIdAndUpdate(
      roleDto.targetUserId,
      {
        role: roleDto.role,
      },
    )

    if (!targetUser) {
      throw new BadRequestException('Target user not found')
    }

    return targetUser.toJSON()
  }

  async updateUserCash(cashDto: CashDto) {
    const user = await this.findOneByUserId(cashDto.userId)

    await this.userModel.updateOne(
      {
        id: user.id,
      },
      {
        $inc: { cash: cashDto.cash },
      },
    )
  }

  async updateUserItem(itemDto: ItemDto) {
    const user = await this.findOneByUserId(itemDto.userId)

    await this.userModel.updateOne(
      {
        id: user.id,
      },
      {
        $push: { items: itemDto.item },
      },
    )
  }
}
