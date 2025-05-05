import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  collegeAr: string;

  @IsNotEmpty()
  @IsString()
  collegeEn: string;

  @IsNotEmpty()
  @IsString()
  majorAr: string;

  @IsNotEmpty()
  @IsString()
  majorEn: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  // @IsNumber()
  @Type(() => Number)
  @IsInt()
  @Min(3)
  @Max(7)
  yearsNum: number;
}
