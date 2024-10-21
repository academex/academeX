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

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 12)
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
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
