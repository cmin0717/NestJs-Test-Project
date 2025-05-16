import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { SignupDto } from './user.dto'

@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('findOneByUserId')
  async findOneByUserId(@Query('userId') userId: string) {
    console.log('userId', userId)
    return this.userService.findOneByUserId(userId)
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto)
  }
}
