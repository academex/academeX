import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Post, Prisma, ReactionType, User } from '@prisma/client';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { StorageService } from 'src/modules/storage/storage.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  /**
   * Creates a new post.
   *
   * @param createPostDto - The data transfer object containing the details of the post to be created.
   * @param user - The user creating the post.
   * @param uploads - An object containing the images and file to be uploaded.
   * @returns The created post.
   * @throws {BadRequestException} If the user's tag is not found.
   * @throws {BadRequestException} If the user's tag is not included in the provided tags.
   * @throws {BadRequestException} If the provided tags are not valid.
   * @throws {BadRequestException} If all tags are not from the same college as the user's tag.
   */
  async create(
    createPostDto: CreatePostDto,
    user: User,
    uploads: { images?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const { tagIds, content } = createPostDto;

    // Tags validation
    // getting user tag info
    const userTag = await this.prisma.tag.findUnique({
      where: { id: user.tagId },
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

    if (tags.length !== tagIds.length && tags.length !== 0) {
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

    const post = await this.prisma.post.create({
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
          connect: { id: user.id },
        },
        tags: {
          connect: tagIds.map((tagId) => ({ id: tagId })),
        },
      },
    });

    return this.prisma.post.findUnique({
      where: {
        id: post.id,
      },
      include: { postUploads: true },
    });
  }

  async findAll(user: User): Promise<Post[]> {
    const id = user.tagId;

    const posts = await this.prisma.post.findMany({
      where: {
        tags: {
          some: { id },
        },
      },
      // in reactions: just the total number, num of each type, the first 2 users
      include: {
        user: { select: { username: true, id: true, photoUrl: true } },
        reactions: {
          select: {
            type: true,
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
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, id: true, photoUrl: true } },
        reactions: {
          select: {
            type: true,
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
    if (!post) throw new BadRequestException('no post with this id');
    return post;
  }

  async reactToPost(id: number, user: User, type: ReactionType) {
    const react = await this.prisma.reaction.create({
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
    return react;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
