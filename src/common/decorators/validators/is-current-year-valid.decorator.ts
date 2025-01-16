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
export class IsValidCurrentYearConstraint
  implements ValidatorConstraintInterface
{
  async validate(currentYear: number, args: ValidationArguments) {
    const tagId = (args.object as any).tagId;
    if (!tagId) return true;

    //get the tagId from user

    // const tag = await prisma.tag.findUnique({
    //   where: { id: tagId },
    //   select: { minYear: true, maxYear: true },
    // });

    // if (!tag) return false; // Tag not found

    // return currentYear >= tag.minYear && currentYear <= tag.maxYear;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid current year for the selected tag.';
  }
}

export function IsValidCurrentYear(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCurrentYearConstraint,
    });
  };
}
