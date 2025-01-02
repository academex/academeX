import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  tagIds: number[];
}
