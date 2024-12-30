import { IsNotEmpty, IsString } from 'class-validator';
import { FileData } from '../interfaces';

export class CreateFileDto implements FileData {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
