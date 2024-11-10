import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Post, Prisma, ReactionType, User } from '@prisma/client';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // todo: in file case:
  // upload file, (in case of wrong throw an exception)
  //  create a new file with the returned url, using createOrConnect in create fun
  async create(createPostDto: CreatePostDto, user: User) {
    const { tagIds, ...rest } = createPostDto;

    let tagIdsAsNumbers;
    // Convert the tagIds array into numbers
    if (tagIds) {
      tagIdsAsNumbers = tagIds.map((id) => Number(id));
  
      // Find the tags using the converted tagIds
      const tags = await this.prisma.tag.findMany({
        where: { id: { in: tagIdsAsNumbers } },
      });
  
      if (tags.length !== tagIdsAsNumbers.length) {
        throw new BadRequestException('Some tags do not exist');
      }
    }

    const post = await this.prisma.post.create({
      data: {
        ...rest,
        user: {
          connect: { id: user.id },
        },
        tags: {
          connect: tagIdsAsNumbers.map((tagId) => ({ id: tagId })),
        },
      },
    });

    return post;
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
