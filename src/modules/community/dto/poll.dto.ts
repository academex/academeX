import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePollOptionDto } from './poll-option.dto';

export class CreatePollDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreatePollOptionDto)
  // options: CreatePollOptionDto[];
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options?: string[];
}
