import { Gender } from '@prisma/client';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  IsInt,
  IsPhoneNumber,
  IsIn,
  Length,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { IsEmailUnique, IsUsernameUnique } from 'src/common/decorators/validators';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 12)
  @IsUsernameUnique()
  username?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @IsEmailUnique()
  email?: string;

  @IsOptional()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  currentYear?: number;

  @IsOptional()
  @IsPhoneNumber()
  @Length(10)
  phoneNum?: string;

  @IsOptional()
  @IsNumber()
  tagId?: number;
}
