import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Comment, Post, Reply, Role, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { CreateReplyDto } from '../dto/create-reply';
import { ReplyResponse } from 'src/common/interfaces/reply.interface';
import { replySelect } from 'src/common/prisma/selects/reply.select';
import { baseUserSelect } from 'src/common/prisma/selects';
import { UpdateCommentDto } from '../dto/update-comment';

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
      select: replySelect,
    });

    return { ...reply, repliedTo: null };
  }

  async findCommentReplies(commentId: number): Promise<ReplyResponse[]> {
    await this.findCommentOrThrow(commentId);
    const replies = await this.prisma.reply.findMany({
      where: { commentId },
      select: replySelect,
      orderBy: { createdAt: 'asc' },
    });

    const data = replies.map(({ parent, ...reply }) => ({
      ...reply,
      repliedTo: parent?.user || null,
      isLiked: false,
    }));
    return data;
  }

  async updateReply(
    { content }: UpdateCommentDto,
    id: number,
    commentId: number,
    user: User,
  ): Promise<ReplyResponse> {
    await this.findCommentOrThrow(commentId);
    const reply = await this.prisma.reply.findFirst({
      where: { id, userId: user.id },
    });

    if (!reply) throw new NotFoundException('Reply not found');

    const { parent, ...updatedReply } = await this.prisma.reply.update({
      where: { id },
      data: { content },
      select: replySelect,
    });
    return {
      message: 'reply updated successfully',
      ...updatedReply,
      repliedTo: parent?.user || null,
    };
  }

  async deleteReply(id: number, commentId: number, user: User) {
    await this.findCommentOrThrow(commentId);
    const reply = await this.prisma.reply.findUnique({
      where: { id },
    });

    if (!reply) throw new NotFoundException('Reply not found');
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

  //! Helper Functions
  async findCommentOrThrow(commentId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      throw new NotFoundException(`no comment found with id ${commentId}`);
    return comment;
  }
}
