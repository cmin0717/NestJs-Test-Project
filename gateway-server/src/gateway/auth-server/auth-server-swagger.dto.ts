import { ApiProperty } from '@nestjs/swagger'
import { RoleEnum } from './auth-server.enum'

export class LoginDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  email!: string

  @ApiProperty({
    description: '비밀번호',
    example: 'test1234',
  })
  password!: string
}

export class SignupDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  email!: string

  @ApiProperty({
    description: '비밀번호',
    example: 'test1234',
  })
  password!: string
}

export class UpdateUserRoleDto {
  @ApiProperty({
    description: '대상 유저 아이디',
    example: '68298d73cfbe2617fe9eaa81',
  })
  targetUserId!: string

  @ApiProperty({
    description: '대상 유저를 변경할 Role 값',
    enum: ['USER', 'ADMIN', 'OPERATOR', 'AUDITOR'],
  })
  role!: RoleEnum
}
