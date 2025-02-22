import { Gender } from '@prisma/client';
import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsString,
  IsOptional,
  IsNumber,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import {
  IsEmailUnique,
  IsUsernameUnique,
} from 'src/common/decorators/validators';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 12)
  @IsUsernameUnique()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsNumber()
  currentYear: number;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(10)
  phoneNum: string;

  @IsNotEmpty()
  @IsNumber()
  tagId: number;
}
