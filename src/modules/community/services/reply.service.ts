import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment, Post, Reply, Role, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateReplyDto } from '../dto/create-reply.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { replySelect, ReplySelectType } from 'src/common/prisma/selects';
import { ReplyResponse } from 'src/common/interfaces';

@Injectable()
export class ReplyService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReplyDto: CreateReplyDto,
    commentId: number,
    user: User,
  ): Promise<ReplyResponse> {
    const { content, parentId } = createReplyDto;
    //check if the comment exists
    await this.findCommentOrThrow(commentId);

    //in case there's parentId check if the parentId exists
    if (parentId) {
      // parent reply & reply we ganna create must belongs to same comment
      const parent = await this.prisma.reply.findUnique({
        where: { id: parentId, commentId },
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
      select: replySelect,
    });

    return this.serializeReply(reply, 0, false);
  }

  async findCommentReplies(
    commentId: number,
    user: User,
  ): Promise<ReplyResponse[]> {
    await this.findCommentOrThrow(commentId);
    const replies = await this.prisma.reply.findMany({
      where: { commentId },
      select: replySelect,
      orderBy: { createdAt: 'asc' },
    });

    return await Promise.all(
      replies.map(async (reply) => {
        const likes = await this.prisma.replyLike.count({
          where: { replyId: reply.id },
        });

        const isLiked = await this.prisma.replyLike.findUnique({
          where: {
            userId_replyId: {
              userId: user.id,
              replyId: reply.id,
            },
          },
        });
        return this.serializeReply(reply, likes, !!isLiked);
      }),
    );
  }

  async updateReply(
    { content }: UpdateCommentDto,
    id: number,
    commentId: number,
    user: User,
  ): Promise<ReplyResponse> {
    await this.findCommentOrThrow(commentId);
    const reply = await this.prisma.reply.findFirst({
      where: { id, userId: user.id, commentId },
    });

    if (!reply)
      throw new NotFoundException(
        'Reply not found, make sure you are the owner of the reply and it belongs to the comment',
      );

    const data = await this.prisma.reply.update({
      where: { id },
      data: { content },
      select: replySelect,
    });

    const likes = await this.prisma.replyLike.count({
      where: { replyId: reply.id },
    });

    const isLiked = await this.prisma.replyLike.findUnique({
      where: {
        userId_replyId: {
          userId: user.id,
          replyId: reply.id,
        },
      },
    });
    return {
      message: 'reply updated successfully',
      ...this.serializeReply(data, likes, !!isLiked),
    };
  }

  async deleteReply(id: number, commentId: number, user: User) {
    await this.findCommentOrThrow(commentId);
    const reply = await this.prisma.reply.findUnique({
      where: { id, commentId },
    });

    if (!reply)
      throw new NotFoundException(
        'Reply not found, make sure of the id and it belongs to the comment',
      );
    if (reply.userId !== user.id && user.role !== Role.ADMIN)
      throw new UnauthorizedException(
        'You are not authorized to delete this reply',
      );

    try {
      return await this.prisma.$transaction(async (tx) => {
        await tx.reply.deleteMany({
          where: { parentId: id },
        });

        await tx.reply.delete({
          where: { id },
        });

        return { message: 'Reply and its responses deleted successfully' };
      });
    } catch (error) {
      console.log('error in delete reply catch block', error);
      throw new BadRequestException(
        'Failed to delete reply. Please try again later.',
      );
    }
  }

  async likeReply(replyId: number, commentId: number, user: User) {
    await this.findCommentOrThrow(commentId);

    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId, commentId },
    });

    if (!reply)
      throw new NotFoundException(
        'Reply not found, make sure it belongs to the comment',
      );

    const existingLike = await this.prisma.replyLike.findUnique({
      where: {
        userId_replyId: {
          userId: user.id,
          replyId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.replyLike.delete({
        where: {
          userId_replyId: {
            userId: user.id,
            replyId,
          },
        },
      });
      return { message: 'Reply unliked successfully' };
    } else {
      await this.prisma.replyLike.create({
        data: {
          replyId,
          userId: user.id,
        },
      });
      return { message: 'Reply liked successfully' };
    }
  }

  //! Dependencies Functions
  async deleteCommentReplies(commentId: number) {
    await this.findCommentOrThrow(commentId);
    try {
      await this.prisma.reply.deleteMany({
        where: { commentId },
      });

      return { message: "comment's replies deleted successfully" };
    } catch (error) {
      throw new BadRequestException(
        "Failed to delete comment's replies. Please try again later.",
      );
    }
  }

  async commentRepliesCount(commentId: number): Promise<number> {
    await this.findCommentOrThrow(commentId);
    try {
      return await this.prisma.reply.count({ where: { commentId } });
    } catch (error) {
      throw new BadRequestException(
        "Failed to get comment's replies count. Please try again later.",
      );
    }
  }

  //! Helper Functions
  async findCommentOrThrow(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      throw new NotFoundException(`no comment found with id ${commentId}`);
    return comment;
  }

  serializeReply(
    { id, content, createdAt, updatedAt, parent, comment, user },
    likes: number,
    isLiked?: boolean,
  ): ReplyResponse {
    return {
      id,
      content,
      createdAt,
      updatedAt,
      comment,
      user,
      likes,
      isLiked: isLiked || false,
      repliedTo: parent || null,
    };
  }
}
