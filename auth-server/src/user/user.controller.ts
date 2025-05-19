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
import { RequestUser, RequestUserData } from 'src/common/user.decorator'
import { IsObjectIdPipe } from '@nestjs/mongoose'

@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/findOneByUserId')
  async findOneByUserId(@Query('userId') userId: string) {
    return this.userService.findOneByUserId(userId)
  }

  @Get('/userRequestSuccessHistory')
  async getUserRequestSuccessHistory(
    @Query('userId') userId: string,
    @Query('eventDetailId') eventDetailId: string,
  ) {
    return this.userService.getUserRequestSuccessHistory(userId, eventDetailId)
  }

  @Post('/signup')
  signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto)
  }

  @Patch('/role')
  async updateUserRole(
    @RequestUser() user: RequestUserData,
    @Body() roleDto: RoleDto,
  ) {
    return this.userService.updateUserRole(user.id, roleDto)
  }

  @Patch('/cash/:userId')
  async updateUserCash(
    @Param('userId', IsObjectIdPipe) userId: string,
    @Body() cashDto: UserCashDto,
  ) {
    return this.userService.updateUserCash(userId, cashDto)
  }

  @Patch('/item/:userId')
  async updateUserItem(
    @Param('userId', IsObjectIdPipe) userId: string,
    @Body() itemDto: UserItemDto,
  ) {
    return this.userService.updateUserItem(userId, itemDto)
  }

  @Patch('/coupon/:userId')
  async updateUserCoupon(
    @Param('userId', IsObjectIdPipe) userId: string,
    @Body() couponDto: UserCouponDto,
  ) {
    return this.userService.updateUserCoupon(userId, couponDto)
  }
}
