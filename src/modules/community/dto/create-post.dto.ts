import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePollDto } from './poll.dto';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  tagIds: number[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePollDto)
  poll?: CreatePollDto;
}
