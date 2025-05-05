import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  collegeAr: string;

  @IsOptional()
  @IsString()
  collegeEn: string;

  @IsOptional()
  @IsString()
  majorAr: string;

  @IsOptional()
  @IsString()
  majorEn: string;

  @IsOptional()
  @IsNumber()
  @Min(3)
  @Max(7)
  yearsNum: number;
}
