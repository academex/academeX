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
import { CommentService } from '../services';
import { CreateCommentDto } from '../dto/create-comment';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UserIdentity() user: User,
  ) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get('post/:postId')
  findPostComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.findPostComments(postId);
  }

  @Get(':id')
  findComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findComment(id);
  }
}
