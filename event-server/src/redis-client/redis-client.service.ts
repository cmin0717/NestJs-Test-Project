import { Injectable, OnModuleInit } from '@nestjs/common'

import { createClient, RedisClientType, SetOptions } from 'redis'

interface EvalOptions {
  keys?: Array<string>
  arguments?: Array<string>
}

@Injectable()
export class RedisClientService implements OnModuleInit {
  private redisClient!: RedisClientType

  constructor() {}

  async onModuleInit() {
    this.redisClient = createClient({
      url: process.env.REDIS_URI || 'redis://localhost:6379',
    })

    await this.redisClient.connect()
  }

  async set(key: string, value: string, options?: SetOptions) {
    return await this.redisClient.set(key, value, options)
  }

  async eval(script: string, options?: EvalOptions) {
    return await this.redisClient.eval(script, options)
  }
}
