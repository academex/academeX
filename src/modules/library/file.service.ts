import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { Library, LibraryType, User } from '@prisma/client';
import { LibraryFileResponse, PaginatedResponse } from 'src/common/interfaces';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { fileSelect } from 'src/common/prisma/selects';
import { FilterFilesDto } from './dto/filter-files.dto';
import { FilterTypedFilesDto } from './dto/filter-typed-files.dto';

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
    filteringOptions: { tagId: number; yearNum: number },
  ): Promise<LibraryFileResponse[]> {
    const tagId = filteringOptions.tagId || user.tagId;
    const yearNum = filteringOptions.yearNum || 1;

    const whereCondition = {
      AND: [{ tags: { some: { id: tagId } } }, { yearNum }],
    };

    const files = await this.prisma.library.findMany({
      where: whereCondition,
      select: fileSelect(user),
      orderBy: { updatedAt: 'desc' },
    });

    // todo: in memory approach,
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

    return data;
  }

  async getFilesByType(
    user: User,
    { tagId, yearNum }: { tagId: number; yearNum: number },
    paginationOptions: { skip: number; take: number },
    { page, limit }: FilterTypedFilesDto,
    type: LibraryType,
  ): Promise<PaginatedResponse<LibraryFileResponse>> {
    const whereCondition = {
      AND: [{ tags: { some: { id: tagId } } }, { yearNum }],
    };
    const [total, files] = await Promise.all([
      this.prisma.library.count({ where: whereCondition }),
      this.prisma.library.findMany({
        where: { ...whereCondition, type },
        select: fileSelect(user),
        ...paginationOptions,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const starredFiles = await this.prisma.star.findMany({
      where: { userId: user.id },
      select: { libraryId: true },
    });

    const starredSet = new Set(starredFiles.map((s) => s.libraryId));

    const data = await Promise.all(
      files.map(async (file) => {
        const isStared = starredSet.has(file.id);
        return { ...file, isStared };
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
}
