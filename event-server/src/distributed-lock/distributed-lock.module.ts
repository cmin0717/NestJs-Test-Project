import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

import { RedisClientModule } from '../redis-client/redis-client.module'

import { CriticalSectionDecoratorRegister } from './decorator/critical-section.decorator'
import { DistributedLockService } from './distributed-lock.service'

@Module({
  imports: [DiscoveryModule, RedisClientModule],
  providers: [DistributedLockService, CriticalSectionDecoratorRegister],
  exports: [DistributedLockService],
})
export class DistributedLockModule {}
