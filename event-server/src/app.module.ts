import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RedisClientModule } from './redis-client/redis-client.module'
import { DistributedLockModule } from './distributed-lock/distributed-lock.module'
import { AppController } from './app.controller'
import { EventModule } from './event/event.module'
import { RewardModule } from './reward/reward.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/event-server'),
    RedisClientModule,
    DistributedLockModule,
    EventModule,
    RewardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
