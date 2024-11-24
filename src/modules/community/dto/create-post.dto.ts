import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFileDto } from 'src/common/dtos/create-file.dto';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  tagIds: number[];

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => CreateFileDto)
  // fileData?: CreateFileDto;
}
