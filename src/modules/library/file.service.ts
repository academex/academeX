import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { Library, User } from '@prisma/client';
import { LibraryFileResponse, PaginatedResponse } from 'src/common/interfaces';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { fileSelect } from 'src/common/prisma/selects';
import { FilterFilesDto } from './dto/filter-files.dto';

@Injectable()
export class FileService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    fileData: CreateFileDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<LibraryFileResponse> {
    // todo: validate the yearNum to fit the tag.
    const { tagIds, ...restData } = fileData;

    // validate tags
    const tags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });

    if (tags.length !== tagIds.length) {
      throw new BadRequestException(
        'Tags not valid, please provide valid tags',
      );
    }

    const { path, url, fileName, fileSize, mimeType } =
      await this.storageService.uploadPDF(file);

    const newFile = await this.prisma.library.create({
      data: {
        ...restData,
        tags: {
          connect: tagIds.map((tagId) => ({ id: tagId })),
        },
        url,
        size: fileSize,
        mimeType,
        user: {
          connect: { id: user.id },
        },
      },
      select: fileSelect(user),
    });

    return { ...newFile, isStared: false };
  }

  async findAll(
    user: User,
    paginationOptions: { skip: number; take: number },
    filteringOptions: { tagId: number; yearNum: number },
    { page, limit }: FilterFilesDto,
  ): Promise<PaginatedResponse<LibraryFileResponse>> {
    const tagId = filteringOptions.tagId || user.tagId;
    const yearNum = filteringOptions.yearNum || 1;

    const whereCondition = {
      AND: [{ tags: { some: { id: tagId } } }, { yearNum }],
    };

    const [total, files] = await Promise.all([
      this.prisma.library.count({ where: whereCondition }),
      this.prisma.library.findMany({
        where: whereCondition,
        select: fileSelect(user),
        ...paginationOptions,
      }),
    ]);

    const data = await Promise.all(
      files.map(async (file) => {
        const isStared = user
          ? await this.prisma.star.findUnique({
              where: {
                userId_libraryId: { userId: user.id, libraryId: file.id },
              },
            })
          : false;
        const readyPost = {
          ...file,
          isStared: !!isStared,
        };
        return readyPost;
      }),
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        PagesCount: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} library`;
  }

  update(id: number, updateLibraryDto) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
