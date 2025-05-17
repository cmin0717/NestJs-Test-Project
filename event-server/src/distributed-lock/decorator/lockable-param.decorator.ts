export const LOCK_PARAM = 'lockable.param'
export function LockParam(): ParameterDecorator {
  return (target, propertyKey, index) => {
    const existingParams: number[] =
      Reflect.getOwnMetadata(LOCK_PARAM, target.constructor, propertyKey) || []
    existingParams.push(index)

    Reflect.defineMetadata(
      LOCK_PARAM,
      existingParams,
      target.constructor,
      propertyKey,
    )
  }
}
