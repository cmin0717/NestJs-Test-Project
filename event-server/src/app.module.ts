import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RedisClientModule } from './redis-client/redis-client.module'
import { DistributedLockModule } from './distributed-lock/distributed-lock.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/event-server'),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
      },
    }),
    RedisClientModule,
    DistributedLockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
