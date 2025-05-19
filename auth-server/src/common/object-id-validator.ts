import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { isValidObjectId } from 'mongoose'

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  async transform(value: string) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid ObjectId`)
    }

    return value
  }
}

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isValidObjectId(value)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid ObjectId`
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdConstraint,
    })
  }
}
