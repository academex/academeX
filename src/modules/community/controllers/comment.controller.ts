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
import { CommentService } from '../services';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { FilterCommentsDto } from '../dto/filter-comments.dto';
import { buildPaginationOptions } from 'src/common/utils';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CreateCommentsDto } from '../dto/create-comments.dto';

@Controller(`post/:postId/comment`)
export class CommentController {
  constructor(private commentService: CommentService) {}
  // create one comment
  @Post()
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @UserIdentity() user: User,
  ) {
    return this.commentService.create(createCommentDto, postId, user);
  }

  // create many comment in one req
  @Post('many')
  createComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentsDto: CreateCommentsDto,
    @UserIdentity() user: User,
  ) {
    return this.commentService.createComments(createCommentsDto, postId, user);
  }

  @Get('')
  findPostComments(
    @UserIdentity() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Query() { page, limit }: FilterCommentsDto,
  ) {
    const paginationOptions = buildPaginationOptions({ page, limit });

    return this.commentService.findPostComments(
      postId,
      paginationOptions,
      {
        page,
        limit,
      },
      user,
    );
  }

  @Get(':id')
  findComment(
    @UserIdentity() user: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentService.findComment(id, postId, user);
  }

  @Put(':id')
  updateComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserIdentity() user: User,
  ) {
    return this.commentService.updateComment(
      updateCommentDto,
      id,
      postId,
      user,
    );
  }

  @Delete(':id')
  deleteComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() user: User,
  ) {
    return this.commentService.deleteComment(id, postId, user);
  }

  @Get(':id/like')
  likeComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() user: User,
  ) {
    return this.commentService.likeComment(id, postId, user);
  }
}
