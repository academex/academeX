import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Tag, User } from '@prisma/client';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    admin: User,
    data: CreateTagDto,
    photoUrl: Express.Multer.File,
  ): Promise<Tag> {
    const tagExists = await this.prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (tagExists) throw new BadRequestException('tag is already exists');

    const photoUrlPath = await this.storageService.uploadTagImage(photoUrl);

    const tag = await this.prisma.tag.create({
      data: {
        ...data,
        photoUrl: photoUrlPath.url,
        createdBy: admin.username,
      },
    });

    return tag;
  }

  async findAll(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany();
    return tags;
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('tag not found');
    return tag;
  }

  async getColleges(): Promise<{ collegeEn: string; collegeAr: string }[]> {
    const colleges = await this.prisma.tag.findMany({
      select: {
        collegeAr: true,
        collegeEn: true,
      },
      distinct: ['collegeEn'],
    });
    return colleges;
  }

  async getMajorsByCollege(collegeEn: string): Promise<Tag[]> {
    if (!collegeEn) throw new BadRequestException('missing collegeEn prop!!');
    const tags = await this.prisma.tag.findMany({
      where: {
        collegeEn,
      },
    });
    return tags;
  }

  async getCollegeTags(user: User): Promise<Tag[]> {
    const { tagId } = user;
    const userTag = await this.prisma.tag.findUnique({
      where: { id: tagId },
    });

    const tags = await this.prisma.tag.findMany({
      where: {
        collegeEn: userTag.collegeEn,
      },
    });
    return tags;
  }

  async toggleTagActivation(id: number, admin: User, isActive: boolean) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException('tag not found');
    if (tag.isActive === isActive)
      throw new BadRequestException('tag is already in the desired state');

    return await this.prisma.tag.update({
      where: { id },
      data: { isActive, updatedBy: admin.username },
    });
  }

  async update(
    admin: User,
    data: UpdateTagDto,
    photoUrl: Express.Multer.File,
    id: number,
  ) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('tag not found');

    let photoUrlPath = tag.photoUrl;
    if (photoUrl) {
      photoUrlPath = (await this.storageService.uploadTagImage(photoUrl)).url;
    }

    return await this.prisma.tag.update({
      where: { id },
      data: { ...data, photoUrl: photoUrlPath, updatedBy: admin.username },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
