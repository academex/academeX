import { IsNumber, IsOptional } from 'class-validator';

export class FilterPostsDto {
  @IsOptional()
  tagId: string;

  @IsOptional()
  page: string;

  @IsOptional()
  limit: string;
}
