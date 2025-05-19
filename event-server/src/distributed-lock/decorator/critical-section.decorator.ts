import { Injectable, OnModuleInit, SetMetadata } from '@nestjs/common'
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'

import { DistributedLockService } from '../distributed-lock.service'

import { LOCK_PARAM } from './lockable-param.decorator'

export const CRITICAL_SECTION = Symbol('CRITICAL_SECTION')
export function CriticalSection(options: CriticalSectionOptions) {
  options.expirationMillis = options.expirationMillis ?? 60 * 1000
  if (options.autoRelease === undefined) {
    options.autoRelease = true
  }

  return SetMetadata(CRITICAL_SECTION, options)
}

export interface CriticalSectionOptions {
  keyPrefix: string
  expirationMillis?: number
  autoRelease?: boolean
}

@Injectable()
export class CriticalSectionDecoratorRegister implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly distributedLockService: DistributedLockService,
  ) {}

  onModuleInit() {
    return this.discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ instance }) => {
        this.metadataScanner.scanFromPrototype(
          instance,
          Object.getPrototypeOf(instance),
          (methodName) => {
            const metadata: CriticalSectionOptions = this.reflector.get(
              CRITICAL_SECTION,
              instance[methodName],
            )
            if (!metadata) {
              return
            }
            const methodRef = instance[methodName]
            const metaKeys = Reflect.getOwnMetadataKeys(methodRef)
            const metaDataList = metaKeys.map((k) => [
              k,
              Reflect.getMetadata(k, methodRef),
            ])

            const lockKeyIndex: number[] = Reflect.getOwnMetadata(
              LOCK_PARAM,
              instance.constructor,
              methodName,
            )

            const { keyPrefix, expirationMillis, autoRelease } = metadata

            instance[methodName] = async (...args: any[]) => {
              let lockParam = keyPrefix + ':'

              lockKeyIndex?.forEach((index) => {
                const parameter = args[index]
                if (typeof parameter === 'string') {
                  lockParam = lockParam + parameter + ':'
                } else if (typeof parameter.getLockKey === 'function') {
                  lockParam = lockParam + parameter.getLockKey() + ':'
                }
              })

              let result
              const lockIdentity =
                await this.distributedLockService.acquireLock(
                  lockParam,
                  expirationMillis,
                )
              try {
                result = await methodRef.call(instance, ...args)
              } finally {
                if (autoRelease) {
                  await this.distributedLockService.releaseLock(
                    lockParam,
                    lockIdentity,
                  )
                }
              }
              return result
            }

            metaDataList.forEach(([k, v]) =>
              Reflect.defineMetadata(k, v, instance[methodName]),
            )
          },
        )
      })
  }
}
