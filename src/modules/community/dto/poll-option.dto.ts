import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePollOptionDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
