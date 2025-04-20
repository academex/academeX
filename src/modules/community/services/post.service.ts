import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { ReactionType, User } from '@prisma/client';
import { CreatePostDto } from '../dto/create-post.dto';
import { StorageService } from 'src/modules/storage/storage.service';
import { FilterPostsDto } from '../dto/filter-posts.dto';
import { baseUserSelect, postSelect } from 'src/common/prisma/selects';
import { PaginatedResponse, PostResponse } from 'src/common/interfaces';
import { serializePaginatedPosts, serializePost } from 'src/common/serializers';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    uploads: { images?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ): Promise<PostResponse> {
    const { tagIds, content, poll } = createPostDto;

    // Tags validation
    await this.validateTags(tagIds, user.tagId);

    // Upload images and file, if exists
    const { imageUrls, file } = await this.handleUploads(uploads);

    const post = await this.prisma.post.create({
      data: {
        content,
        ...(imageUrls.length > 0 && {
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
          connect: { id: user.id },
        },
        tags: {
          connect: tagIds.map((tagId) => ({ id: tagId })),
        },
        ...(poll && {
          poll: {
            create: {
              question: poll.question,
              endDate: poll.endDate,
              pollOptions: {
                create: poll.options.map((option, indx) => ({
                  content: option,
                  order: indx,
                })),
              },
            },
          },
        }),
      },
      select: postSelect(user),
    });

    if (!post)
      throw new BadRequestException(
        'something went wrong while creating the post',
      );

    return serializePost(post);
  }

  async findAll(
    user: User,
    paginationOptions: { skip: number; take: number },
    filteringOptions: { tagId: number },
    { page, limit }: FilterPostsDto,
  ): Promise<PaginatedResponse<PostResponse>> {
    const tagId = filteringOptions.tagId || user.tagId;
    const whereCondition = {
      tags: {
        some: { id: tagId },
      },
    };

    return this.getReadyPosts(
      paginationOptions,
      { page, limit },
      user,
      whereCondition,
    );
  }

  async findPopular(
    user: User | undefined,
    paginationOptions: { skip: number; take: number },
    { page, limit }: FilterPostsDto,
  ): Promise<PaginatedResponse<PostResponse>> {
    return this.getReadyPosts(paginationOptions, { page, limit }, user);
  }

  async userPosts(
    username: string,
    user: User,
    paginationOptions: { skip: number; take: number },
    { page, limit }: FilterPostsDto,
  ) {
    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!userExists) throw new NotFoundException('User not found');

    const whereCondition = {
      user: { username },
    };
    return this.getReadyPosts(
      paginationOptions,
      { page, limit },
      user,
      whereCondition,
    );
  }

  async findOne(id: number, user: User): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: postSelect(user),
    });
    if (!post) throw new BadRequestException(`No post with this Id: ${id}`);

    const isReacted = await this.prisma.reaction.findFirst({
      where: { userId: user.id, postId: post.id },
    });
    return {
      ...serializePost(post),
      isSaved: post?.savedPosts.length > 0,
      isReacted: isReacted ? true : false,
      reactionType: isReacted?.type || null,
    };
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
      // checking if the post is exist
      const post = await this.prisma.post.findUnique({
        where: { id },
      });
      if (!post) throw new BadRequestException('Post not found');
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

  async getPostReactions(
    postId: number,
    type: ReactionType,
    paginationOptions: { skip: number; take: number },
    { page, limit }: { page: number; limit: number },
  ) {
    const whereCondition = {
      postId,
      type,
    };

    const total = await this.prisma.reaction.count({
      where: whereCondition,
    });

    const data = await this.prisma.reaction.findMany({
      where: whereCondition,
      select: {
        id: true,
        type: true,
        user: {
          select: baseUserSelect,
        },
      },
      ...paginationOptions,
    });

    const stat = await this.getReactionsStats(postId);

    return {
      data,
      stat,
      meta: {
        page,
        limit,
        PagesCount: Math.ceil(total / limit),
        total,
      },
    };
  }

<<<<<<< HEAD
<<<<<<< HEAD
  
=======
=======
  async vote(pollId: number, optionId: number, user: User) {
    const userId = user.id;
    return await this.prisma.$transaction(async (tx) => {
      // Get the poll option and its associated poll
      const pollOption = await tx.pollOption.findFirst({
        where: { id: optionId, pollId: pollId },
        select: {
          poll: true,
          id: true,
          content: true,
          order: true,
        },
      });

      if (!pollOption) {
        throw new BadRequestException(
          "Poll option not found, make sure you provide a valid option and poll's data",
        );
      }

      // Check if poll has ended
      if (pollOption.poll.endDate < new Date()) {
        throw new BadRequestException('Poll has ended');
      }

      // Check if user has already voted on this poll
      const existingVote = await tx.pollVote.findUnique({
        where: {
          userId_pollOptionId: {
            userId,
            pollOptionId: optionId,
          },
        },
      });

      if (existingVote) {
        throw new BadRequestException('User has already voted in this poll');
      }

      //update the pollOption count
      await tx.pollOption.update({
        where: { id: optionId },
        data: {
          count: {
            increment: 1,
          },
        },
      });

      // Create the vote
      const voted = await tx.pollVote.create({
        data: {
          pollOption: {
            connect: {
              id: optionId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      if (!voted) {
        throw new BadRequestException('Something went wrong while voting');
      }
      return { message: 'Voted successfully' };
    });
  }

>>>>>>> main
  //! Helper Functions
  private async validateTags(tagIds: number[], userTagId: number) {
    // Get user's tag info
    const userTag = await this.prisma.tag.findUnique({
      where: { id: userTagId },
      select: {
        id: true,
        collegeEn: true,
        name: true,
      },
    });

    if (!userTag) {
      throw new BadRequestException("User's tag not found");
    }

    if (tagIds.length === 0) {
      throw new BadRequestException('Please provide at least one tag');
    }

    // Validate tags
    const tags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });

    if (tags.length !== tagIds.length) {
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
  }

  private async handleUploads(uploads: {
    images?: Express.Multer.File[];
    file?: Express.Multer.File[];
  }) {
    const imageUrls =
      uploads && uploads.images
        ? await this.storageService.uploadImages(uploads.images)
        : [];
    const file =
      uploads && uploads.file
        ? await this.storageService.uploadPDF(uploads.file[0])
        : null;
    return { imageUrls, file };
  }
  async getReactionsStats(postId: number) {
    const typesCount = await this.prisma.reaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: {
        type: true,
      },
    });

    const stat = typesCount.reduce((acc, el) => {
      acc[el.type] = el._count.type;
      return acc;
    }, {});

    return stat;
  }
<<<<<<< HEAD
>>>>>>> main
=======

  async getReadyPosts(
    paginationOptions: { skip: number; take: number },
    { page, limit }: { page: number; limit: number },
    user: User | undefined,
    whereCondition?: any,
  ): Promise<PaginatedResponse<PostResponse>> {
    const [total, posts] = await Promise.all([
      this.prisma.post.count({ where: whereCondition }),
      this.prisma.post.findMany({
        where: whereCondition,
        select: postSelect(user),
        orderBy: { createdAt: 'desc' },
        ...paginationOptions,
      }),
    ]);

    const data = await Promise.all(
      posts.map(async (post) => {
        const isReacted = user
          ? await this.prisma.reaction.findUnique({
              where: { userId_postId: { userId: user.id, postId: post.id } },
            })
          : false;
        const readyPost = {
          ...serializePost(post),
          isReacted: !!isReacted,
          reactionType: (isReacted && isReacted?.type) || null,
        };
        return readyPost;
      }),
    );

    return serializePaginatedPosts(data, { page, limit, total });
  }
>>>>>>> main
}
