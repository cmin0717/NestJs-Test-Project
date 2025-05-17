import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'

import { createClient, RedisClientType, SetOptions } from 'redis'

interface EvalOptions {
  keys?: Array<string>
  arguments?: Array<string>
}

@Injectable()
export class RedisClientService implements OnModuleInit, OnApplicationShutdown {
  private redisClient!: RedisClientType

  constructor() {}

  async onModuleInit() {
    this.redisClient = createClient({
      url: 'redis://localhost:6379',
    })

    await this.redisClient.connect()
  }

  async onApplicationShutdown() {
    if (this.redisClient) {
      await this.redisClient.quit()
    }
  }

  async set(key: string, value: string, options?: SetOptions) {
    return await this.redisClient.set(key, value, options)
  }

  async eval(script: string, options?: EvalOptions) {
    return await this.redisClient.eval(script, options)
  }
}
