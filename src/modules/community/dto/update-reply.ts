import { PartialType } from '@nestjs/swagger';
import { CreateReplyDto } from './create-reply';

export class UpdateReplyDto extends PartialType(CreateReplyDto) {}
