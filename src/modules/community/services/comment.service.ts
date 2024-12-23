import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post, Role, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateCommentDto } from '../dto/create-comment';
import { commentSelect } from 'src/common/prisma/selects';
import { CommentResponse, PaginatedResponse } from 'src/common/interfaces';
import { UpdateCommentDto } from '../dto/update-comment';
import { ReplyService } from './reply.service';

@Injectable()
export class CommentService {
  constructor(
    private prisma: PrismaService,
    private replyService: ReplyService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: number,
    user: User,
  ): Promise<CommentResponse> {
    const { content } = createCommentDto;
    //check if the post exists
    await this.findPostOrThrow(postId);

    // creating comment and return the required data.
    const comment = await this.prisma.comment.create({
      data: {
        content,
        user: {
          connect: { id: user.id },
        },
        post: {
          connect: { id: postId },
        },
      },
      select: commentSelect,
    });

    if (!comment)
      throw new BadRequestException(
        'something went wrong, please try again later',
      );

    return { ...comment, isLiked: false };
  }

  async findPostComments(
    postId: number,
    paginationOptions: { skip: number; take: number },
    { page, limit }: { page: number; limit: number },
  ): Promise<PaginatedResponse<CommentResponse>> {
    await this.findPostOrThrow(postId);

    const whereCondition = {
      postId,
    };

    const total = await this.prisma.comment.count({
      where: whereCondition,
    });

    const data = await this.prisma.comment.findMany({
      where: whereCondition,
      select: commentSelect,
      orderBy: { createdAt: 'desc' },
      ...paginationOptions,
    });
    return {
      data,
      meta: {
        page,
        limit,
        PagesCount: Math.ceil(total / limit),
        total,
      },
    };
  }

  // added findPostOrThrow to make sure the post exists, and returning consistent data for the target post (instead of return a comment that doesn't belong the post in url)
  async findComment(id: number, postId: number): Promise<CommentResponse> {
    await this.findPostOrThrow(postId);

    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: commentSelect,
    });
    if (!comment) throw new NotFoundException(`no comment found with id ${id}`);
    return comment;
  }

  async updateComment(
    { content }: UpdateCommentDto,
    id: number,
    postId: number,
    user: User,
  ): Promise<CommentResponse> {
    await this.findPostOrThrow(postId);

    const comment = await this.prisma.comment.findFirst({
      where: { id, userId: user.id },
    });

    if (!comment) {
      throw new BadRequestException(
        "comment not founded OR you don't own this comment",
      );
    }

    const data = await this.prisma.comment.update({
      where: { id },
      data: { content },
      select: commentSelect,
    });

    return {
      message: 'comment updated successfully',
      ...data,
    };
  }

  async deleteComment(id: number, postId: number, user: User) {
    await this.findPostOrThrow(postId);
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundException('comment not found');

    if (comment.userId !== user.id && user.role !== Role.ADMIN) {
      throw new UnauthorizedException(
        "comment not founded OR you don't own this comment",
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      await this.replyService.deleteCommentReplies(id);

      await tx.comment.delete({
        where: { id },
      });

      return { message: 'comment and its replies deleted successfully' };
    });
  }
  catch(error) {
    console.log('error in delete comment catch block', error);
    throw new BadRequestException(
      'Failed to delete comment. Please try again later.',
    );
  }

  //! Helper Functions
  async findPostOrThrow(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException(`no post found with id ${postId}`);
    return post;
  }
}
