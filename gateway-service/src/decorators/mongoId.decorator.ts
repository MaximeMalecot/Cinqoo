import { ObjectId } from 'bson';
import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsMongoIdObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsMongoIdObject',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `${propertyName} must be a valid mongoId`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return ObjectId.isValid(value);
        },
      },
    });
  };
}
