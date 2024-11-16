import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileData } from '../interfaces/file.interface';

export class CreateFileDto implements FileData {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

// so I have this situation, so in create post I allow user to upload file, so I want to validate
// the file data, so I thought to create a dto for file creation and include it in the create post dto,
// but I remembered that I have the lib module that it's main key is the file, so when creating CRUD for this module
// we must to do a dto for the creation, so now by this we will be did 2 dto for the same goal, so I thought that I may create a dto
// in common/dtos folder, and use it both create-post.dto.ts, and library controller in post fun, then I thought that if we could create a interface named fileType
// and in the create-post dto I can add a prop named fileData with type fileType, and in the library module I can create a separated dto for it.
// so here's my situation, based on your knowledge which one is the best practice or if you have other solution don't hastate to mention it

// finally I think I'm ganna do this:
// create a common dto and use as the main dto in lib module and let the CreatePostDto implement this dto
