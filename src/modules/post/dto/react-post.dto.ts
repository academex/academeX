import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReactionType } from '@prisma/client';

export class ReactToPostDto {
  @IsNotEmpty()
  @IsEnum(ReactionType)
  type: ReactionType;
}
