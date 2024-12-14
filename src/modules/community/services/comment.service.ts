import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateCommentDto } from '../dto/create-comment';
import { basePostSelect, baseUserSelect } from 'src/common/prisma/selects';
import { CommentResponse, PaginatedResponse } from 'src/common/interfaces';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

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
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        likes: true,
        user: {
          select: baseUserSelect,
        },
        post: {
          select: basePostSelect,
        },
      },
    });

    if (!comment)
      throw new BadRequestException(
        'something went wrong while creating the comment',
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
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        likes: true,
        user: {
          select: baseUserSelect,
        },
        post: {
          select: basePostSelect,
        },
      },
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

  async findComment(id: number): Promise<CommentResponse> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        likes: true,
        user: {
          select: baseUserSelect,
        },
        post: {
          select: basePostSelect,
        },
      },
    });
    if (!comment) throw new NotFoundException(`no comment found with id ${id}`);
    return comment;
  }

  //! Helper Functions
  async findPostOrThrow(postId: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post)
      throw new NotFoundException(`no post found with this id ${postId}`);
    return post;
  }
}
