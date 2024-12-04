import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Post, Prisma, ReactionType, User } from '@prisma/client';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { StorageService } from 'src/modules/storage/storage.service';
import { take } from 'rxjs';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    { tagId, id, username, photoUrl }: User,
    uploads: { images?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const { tagIds, content } = createPostDto;

    // Tags validation
    // getting user tag info
    const userTag = await this.prisma.tag.findUnique({
      where: { id: tagId },
      select: {
        id: true,
        collegeEn: true,
        name: true,
      },
    });

    if (!userTag) {
      throw new BadRequestException("User's tag not found");
    }

    // check of all tags it's exists and within the same college
    const tags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });

    if (tags.length != tagIds.length && tagIds.length !== 0) {
      throw new BadRequestException(
        'Tags not valid, please provide valid tags',
      );
    }

    const invalidTags = tags.filter(
      (tag) => tag.collegeEn !== userTag.collegeEn,
    );
    if (invalidTags.length > 0) {
      throw new BadRequestException(
        `All tags must be from the same college as the user's tag (${userTag.name})`,
      );
    }

    // Upload images and file, if exists
    const imageUrls =
      uploads && uploads.images
        ? await this.storageService.uploadImages(uploads.images)
        : [];
    const file =
      uploads && uploads.file
        ? await this.storageService.uploadPDF(uploads.file[0])
        : null;

    const { userId, fileName, fileUrl, ...rest } =
      await this.prisma.post.create({
        data: {
          content,
          ...(imageUrls && {
            postUploads: {
              create: imageUrls.map((el) => ({
                url: el.url,
                name: el.fileName,
                size: el.fileSize,
                mimeType: el.mimeType,
              })),
            },
          }),
          ...(file && {
            fileUrl: file.url,
            fileName: file.fileName,
          }),
          user: {
            connect: { id },
          },
          tags: {
            connect: tagIds.map((tagId) => ({ id: tagId })),
          },
        },
      });

    if (!rest)
      throw new BadRequestException(
        'something went wrong while creating the post',
      );

    return {
      ...rest,
      file: { name: fileName, url: fileUrl },
      images: imageUrls.length,
      user: { id, username, photoUrl },
    };
  }

  async findAll(
    user: User,
    paginationOptions: { skip: number; take: number },
    filteringOptions: { tagId: number },
  ) {
    const tagId = filteringOptions.tagId || user.tagId;

    const posts = await this.prisma.post.findMany({
      where: {
        tags: {
          some: { id: tagId },
        },
      },
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
      orderBy: {
        createdAt: 'desc',
      },
      ...paginationOptions,
    });

    return posts.map((post) => this.serializePost(post));
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
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
    });
    if (!post) throw new BadRequestException(`No post with this Id: ${id}`);
    return this.serializePost(post);
  }

  async reactToPost(id: number, user: User, type: ReactionType) {
    // check if the user has already reacted to the post
    const existingReaction = await this.prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: id,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // If the reaction type is the same, delete the reaction (toggle off)
        await this.prisma.reaction.delete({
          where: {
            id: existingReaction.id,
          },
        });
        return { message: 'Reaction removed' };
      } else {
        // If the reaction type is different, update the reaction
        const updatedReaction = await this.prisma.reaction.update({
          where: {
            id: existingReaction.id,
          },
          data: {
            type,
          },
        });
        return updatedReaction;
      }
    } else {
      // If no existing reaction, create a new one
      const newReaction = await this.prisma.reaction.create({
        data: {
          type,
          user: {
            connect: { id: user.id },
          },
          post: {
            connect: { id },
          },
        },
      });
      return newReaction;
    }
  }

  async getReactionsCount(postId: number) {
    const reactions = await this.prisma.reaction.groupBy({
      by: ['type'],
      where: {
        postId,
      },
      _count: true,
    });

    return reactions.reduce(
      (acc, curr) => {
        acc[curr.type] = curr._count;
        return acc;
      },
      {} as Record<ReactionType, number>,
    );
  }

  //! HELPER FUNCTIONS
  serializePost(post) {
    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      file: {
        url: post.fileUrl || null,
        name: post.fileName || null,
      },
      images: post.postUploads.map((upload) => ({
        id: upload.id,
        url: upload.url,
      })),
      tags: post.tags,
      user: post.user,
      reactions: {
        count: post._count.reactions,
        items: post.reactions,
      },
      comments: post._count.comments,
    };
  }

  
}
