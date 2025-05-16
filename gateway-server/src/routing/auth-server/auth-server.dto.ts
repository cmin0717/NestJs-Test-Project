export interface LoginDto {
  email: string
  password: string
}

export interface SignupDto {
  email: string
  password: string
}

export interface RoleDto {
  targetUserId: string
  role: string
}
