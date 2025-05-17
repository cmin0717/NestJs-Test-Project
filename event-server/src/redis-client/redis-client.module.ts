import { Module } from '@nestjs/common'

import { RedisClientService } from './redis-client.service'

@Module({
  imports: [],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
