import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreateReplyDto } from '../dto/create-reply';
import { ReplyService } from '../services';

@Controller('reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}
  @Post()
  create(@Body() createReplyDto: CreateReplyDto, @UserIdentity() user: User) {
    return this.replyService.create(createReplyDto, user);
  }

  @Get('comment/:commentId')
  findPostComments(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.replyService.findCommentReplies(commentId);
  }

  @Get(':id')
  findComment(@Param('id', ParseIntPipe) id: number) {
    return this.replyService.findReply(id);
  }
}
