import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { FilterPostsDto } from '../dto/filter-posts.dto';
import { serializePost } from 'src/common/libs/serialize-post';

@Injectable()
export class SavePostService {
  constructor(private prisma: PrismaService) {}

  async savePost(user: User, postId: number) {
    const userId = user.id;

    const savedPostExists = await this.prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    // if post already saved, unsave it (toggle save)
    if (savedPostExists) {
      const deletedSavedPost = await this.prisma.savedPost.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      if (!deletedSavedPost)
        throw new BadRequestException('Post unsaved failed');
      return {
        message: 'Post unsaved successfully',
      };
    }

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      // select: { userId: true, id: true },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    if (post.userId === userId) {
      throw new ForbiddenException('Cannot save your own post');
    }

    const savedPost = await this.prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    if (!savedPost) {
      throw new BadRequestException('Post not saved');
    }

    return {
      id: savedPost.id,
      user: user.id,
      post: post.id,
      message: 'Post saved successfully',
    };
  }

  async getSavedPosts(
    user: User,
    paginationOptions: { skip: number; take: number },
    { page, limit }: FilterPostsDto,
  ) {
    const whereCondition = { userId: user.id };

    const total = await this.prisma.savedPost.count({
      where: whereCondition,
    });

    const posts = await this.prisma.savedPost.findMany({
      where: whereCondition,
      select: {
        id: true,
        post: {
          select: {
            id: true,
            content: true,
            postUploads: true,
            fileUrl: true,
            fileName: true,
            createdAt: true,
            updatedAt: true,
            tags: { select: { id: true, name: true } },
            user: {
              select: {
                username: true,
                id: true,
                photoUrl: true,
                firstName: true,
                lastName: true,
              },
            },
            reactions: {
              take: 2,
              select: {
                id: true,
                type: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    photoUrl: true,
                  },
                },
              },
            },
            _count: {
              select: {
                reactions: true,
                comments: true,
              },
            },
          },
        },
      },
      ...paginationOptions,
    });

    const data = posts.map(({ post, id: savedPostId, ...res }) => ({
      ...res,
      savedPostId,
      ...serializePost(post),
    }));

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
}
