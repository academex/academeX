import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10)
  phoneNumber: string;
}
