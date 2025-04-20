import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FilterTypedFilesDto {
  @IsString()
  tagId: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  yearNum: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
