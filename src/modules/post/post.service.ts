import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // todo: in file case: create a new file using lib model
  async create(createPostDto: CreatePostDto, user: User) {
    const { tags, ...rest } = createPostDto;

    // const post = await this.prisma.post.create({ data:{
    //   ...rest,
    //   // tags:{
    //     // connect:[{id:tag}]
    //   // }
    // } });
    // return post;
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
