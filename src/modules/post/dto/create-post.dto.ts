import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

//todo: convert tagIds type to number[], and reflect this changes in postService.
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
