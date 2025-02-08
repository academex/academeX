import { IsString, Length, IsNotEmpty } from 'class-validator';

export class UpdatePassword {
  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 12)
  newPassword: string;
}
