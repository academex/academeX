import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
