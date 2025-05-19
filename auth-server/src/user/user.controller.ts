import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import {
  RoleDto,
  SignupDto,
  UserCashDto,
  UserCouponDto,
  UserItemDto,
} from './dto/user.dto'
import { ObjectIdPipe } from 'src/common/object-id-validator'
import { RequestUser, RequestUserData } from 'src/common/user.decorator'

@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUser(@RequestUser() user: RequestUserData) {
    return this.userService.findOneByUserId(user.id)
  }

  @Get('/findOneByUserId')
  async findOneByUserId(@Query('userId', ObjectIdPipe) userId: string) {
    return this.userService.findOneByUserId(userId)
  }

  @Get('/userRequestSuccessHistory')
  async getUserRequestSuccessHistory(
    @Query('userId', ObjectIdPipe) userId: string,
    @Query('eventDetailId', ObjectIdPipe) eventDetailId: string,
  ) {
    return this.userService.getUserRequestSuccessHistory(userId, eventDetailId)
  }

  @Post('/signup')
  signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto)
  }

  @Patch('/role')
  async updateUserRole(@Body() roleDto: RoleDto) {
    return this.userService.updateUserRole(roleDto)
  }

  @Patch('/cash/:userId')
  async updateUserCash(
    @Param('userId', ObjectIdPipe) userId: string,
    @Body() cashDto: UserCashDto,
  ) {
    return this.userService.updateUserCash(userId, cashDto)
  }

  @Patch('/item/:userId')
  async updateUserItem(
    @Param('userId', ObjectIdPipe) userId: string,
    @Body() itemDto: UserItemDto,
  ) {
    return this.userService.updateUserItem(userId, itemDto)
  }

  @Patch('/coupon/:userId')
  async updateUserCoupon(
    @Param('userId', ObjectIdPipe) userId: string,
    @Body() couponDto: UserCouponDto,
  ) {
    return this.userService.updateUserCoupon(userId, couponDto)
  }
}
