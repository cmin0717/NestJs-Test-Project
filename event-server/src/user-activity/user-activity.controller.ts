import { Controller } from '@nestjs/common'
import { UserActivityService } from './user-activity.service'

@Controller({ path: 'user-activity' })
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}
}
