import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CashDto, ItemDto, RoleDto, SignupDto } from './user.dto'

@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('findOneByUserId')
  async findOneByUserId(@Query('userId') userId: string) {
    return this.userService.findOneByUserId(userId)
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto)
  }

  @Patch('role')
  async updateUserRole(@Body() roleDto: RoleDto) {
    return this.userService.updateUserRole(roleDto)
  }

  @Patch('cash')
  async updateUserCash(@Body() cashDto: CashDto) {
    return this.userService.updateUserCash(cashDto)
  }

  @Patch('item')
  async updateUserItem(@Body() itemDto: ItemDto) {
    return this.userService.updateUserItem(itemDto)
  }
}
