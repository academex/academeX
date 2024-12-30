import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  parentId: number;
}
