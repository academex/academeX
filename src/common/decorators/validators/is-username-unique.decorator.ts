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
export class IsUsernameUniqueConstraint
  implements ValidatorConstraintInterface
{
  async validate(username: string, args: ValidationArguments) {
    const user = await prisma.user.findUnique({ where: { username } });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Username is already taken.';
  }
}

export function IsUsernameUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameUniqueConstraint,
    });
  };
}
