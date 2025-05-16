import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from './user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SignupDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findOneByUserId(userId: string) {
    const user = await this.userModel.findById(userId).exec()

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user.toJSON()
  }

  async signup(signupDto: SignupDto) {
    const user = await this.userModel.findOne({ email: signupDto.email }).exec()

    if (user) {
      throw new UnauthorizedException('User already exists')
    }

    const newUser = new this.userModel(signupDto)
    return await newUser.save()
  }
}
