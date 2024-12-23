import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;
}
