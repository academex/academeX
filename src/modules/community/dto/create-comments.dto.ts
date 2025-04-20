import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentsDto {
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  contents: string[];
}
