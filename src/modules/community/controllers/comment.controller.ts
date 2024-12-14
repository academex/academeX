import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';
import { CommentService } from '../services';
import { CreateCommentDto } from '../dto/create-comment';
import { FilterCommentsDto } from '../dto/filter-comments.dto';
import { buildPaginationOptions } from 'src/common/utils';

@Controller(`post/:postId/comment`)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UserIdentity() user: User,
  ) {
    console.log('postId', postId);
    return this.commentService.create(createCommentDto, postId, user);
  }

  @Get('')
  findPostComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() { page, limit }: FilterCommentsDto,
  ) {
    const paginationOptions = buildPaginationOptions({ page, limit });

    return this.commentService.findPostComments(postId, paginationOptions, {
      page,
      limit,
    });
  }

  @Get(':id')
  findComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findComment(id);
  }
}
