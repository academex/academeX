import { LibraryType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 70)
  name: string;

  @IsOptional()
  @IsEnum(LibraryType)
  type: LibraryType = LibraryType.SUMMARY;

  // @IsOptional()
  @IsString()
  @Length(3, 250)
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  yearNum: number;

  @IsNotEmpty()
  @IsString()
  @Length(3, 70)
  subject: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  tagIds: number[];
}
