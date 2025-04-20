import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@ValidatorConstraint({ async: true })
export class IsValidTagConstraint implements ValidatorConstraintInterface {
  async validate(tagId: number, args: ValidationArguments) {
    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    return !!tag;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Tag not found.';
  }
}

export function IsTagValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTagConstraint,
    });
  };
}
