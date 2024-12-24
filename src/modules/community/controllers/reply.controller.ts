import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { ReplyService } from '../services';
import { UpdateReplyDto } from '../dto/update-reply.dto';

@Controller('comment/:commentId/reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}
  @Post()
  create(
    @Body() createReplyDto: CreateReplyDto,
    @Param('commentId', ParseIntPipe) commentId: number,
    @UserIdentity() user: User,
  ) {
    return this.replyService.create(createReplyDto, commentId, user);
  }

  @Get('')
  findCommentReplies(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.replyService.findCommentReplies(commentId);
  }

  @Put(':id')
  updateReply(
    @UserIdentity() user: User,
    @Body() updateReplyDto: UpdateReplyDto,
    @Param('id', ParseIntPipe) id: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.replyService.updateReply(updateReplyDto, id, commentId, user);
  }

  @Delete(':id')
  deleteReply(
    @UserIdentity() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.replyService.deleteReply(id, commentId, user);
  }
}
