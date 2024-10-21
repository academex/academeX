import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tagData: Prisma.TagCreateInput = {
      ...createTagDto,
    };
    const tagExists = await this.prisma.tag.findUnique({
      where: { name: tagData.name },
    });
    
    if (tagExists) throw new BadRequestException('tag is already exists');
    const tag = await this.prisma.tag.create({
      data: tagData,
    });
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany();
    return tags;
  }

  async findOne(id: number): Promise<Tag> {
    console.log('in findOne with id', id);
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    console.log('tag after getting it', tag);
    if (!tag) throw new NotFoundException('tag not found');
    return tag;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
