import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { RoleDto, SignupDto } from './user.dto'

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
}
