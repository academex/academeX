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

  async getCollegesWithMajors() {
    // const tags = await this.prisma.tag.groupBy({
    //   by: ['college_en', 'college_ar', 'major_en', 'major_ar', 'name'],
    //   orderBy: [{ college_en: 'asc' }, { major_en: 'asc' }],
    // });

    // Efficiently transform the data in memory
    // return tags.reduce((colleges, tag) => {
    //   const existingCollege = colleges.find(
    //     (c) => c.college_en === tag.college_en,
    //   );

    //   if (existingCollege) {
    //     existingCollege.majors.push({
    //       major_en: tag.major_en,
    //       major_ar: tag.major_ar,
    //       name: tag.name,
    //     });
    //   } else {
    //     colleges.push({
    //       college_en: tag.college_en,
    //       college_ar: tag.college_ar,
    //       majors: [
    //         {
    //           major_en: tag.major_en,
    //           major_ar: tag.major_ar,
    //           name: tag.name,
    //         },
    //       ],
    //     });
    //   }

    //   return colleges;
    // }, []);
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
