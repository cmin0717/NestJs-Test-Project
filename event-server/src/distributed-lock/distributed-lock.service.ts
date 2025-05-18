import { BadRequestException, Injectable } from '@nestjs/common'

import { RedisClientService } from '../redis-client/redis-client.service'
import { randomUUID } from 'crypto'

@Injectable()
export class DistributedLockService {
  constructor(private readonly redisClient: RedisClientService) {}

  async acquireLock(
    key: string,
    expirationMillis: number = 1 * 60 * 60 * 1000,
  ) {
    const lockIdentity = randomUUID()

    const result = await this.redisClient.set(key, lockIdentity, {
      NX: true,
      PX: expirationMillis,
    })

    if (result === 'OK') {
      return lockIdentity
    } else {
      throw new BadRequestException('Lock is already occupied', key)
    }
  }

  async releaseLock(key: string, lockIdentity: string) {
    const script = `
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
        `
    const releaseResult = await this.redisClient.eval(script, {
      keys: [key],
      arguments: [lockIdentity],
    })
    return releaseResult === 1
  }
}
