import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, Post, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateCommentDto } from '../dto/create-comment';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const { content, postId } = createCommentDto;
    //check if the post exists
    await this.findPostOrThrow(postId);

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
    });
    return comment;
  }
  async findPostComments(postId: number): Promise<Comment[]> {
    await this.findPostOrThrow(postId);
    const comments = await this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { email: true, username: true, role: true, photoUrl: true },
        },
      },
    });
    return comments;
  }

  async findComment(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
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
