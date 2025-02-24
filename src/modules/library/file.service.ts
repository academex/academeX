import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { User } from '@prisma/client';
import { LibraryFileResponse } from 'src/common/interfaces';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { fileSelect } from 'src/common/prisma/selects';

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
    // validate the yearNum to fit the tag.
    // todo: use validate tags
    const { tagIds, ...restData } = fileData;

    const { path, url, fileName, fileSize, mimeType } =
      await this.storageService.uploadPDF(file);

    return await this.prisma.library.create({
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
  }

  findAll() {
    return `This action returns all library`;
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
