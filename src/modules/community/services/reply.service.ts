import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, Post, Reply, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateReplyDto } from '../dto/create-reply';

@Injectable()
export class ReplyService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReplyDto: CreateReplyDto,
    commentId: number,
    user: User,
  ): Promise<Reply> {
    const { content, parentId } = createReplyDto;
    //check if the comment exists
    await this.findCommentOrThrow(commentId);

    //in case there's parentId check if the parentId exists
    if (parentId) {
      const parent = await this.prisma.reply.findUnique({
        where: { id: parentId },
      });

      if (!parent) throw new NotFoundException('Parent reply not found');
    }
    const reply = await this.prisma.reply.create({
      data: {
        content,
        user: {
          connect: { id: user.id },
        },
        comment: {
          connect: { id: commentId },
        },
        ...(parentId && {
          parent: {
            connect: { id: parentId },
          },
        }),
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
        parent: {
          select: {
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
