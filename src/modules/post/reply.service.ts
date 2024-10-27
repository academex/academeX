import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Comment, Post, Reply, User } from '@prisma/client';
import { CreateReplyDto } from './dto/create-reply';

@Injectable()
export class ReplyService {
  constructor(private prisma: PrismaService) {}

  async create(createReplyDto: CreateReplyDto, user: User): Promise<Reply> {
    const { content, commentId } = createReplyDto;
    //check if the post exists
    await this.findCommentOrThrow(commentId);

    const reply = await this.prisma.reply.create({
      data: {
        content,
        user: {
          connect: { id: user.id },
        },
        comment: {
          connect: { id: commentId },
        },
      },
    });
    return reply;
  }
  async findCommentReplies(commentId: number): Promise<Reply[]> {
    await this.findCommentOrThrow(commentId);
    const replies = await this.prisma.reply.findMany({
      where: { commentId },
      include: {
        // getting the user who have replied.
        user: {
          select: { email: true, username: true, role: true, photoUrl: true },
        },
        // getting the user data who been replied to)
        comment: {
          include: {
            user: {
              select: {
                username: true,
                role: true,
              },
            },
          },
        },
      },
    });
    return replies;
  }

  async findReply(id: number): Promise<Reply> {
    const reply = await this.prisma.reply.findUnique({ where: { id } });
    if (!reply) throw new NotFoundException(`no reply found with id ${id}`);
    return reply;
  }

  //! Helper Functions
  async findCommentOrThrow(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      throw new NotFoundException(`no comment found with this id ${commentId}`);
    return comment;
  }
}
