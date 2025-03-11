import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';

@Injectable()
export class StarFileService {
  constructor(private prisma: PrismaService) {}

  async starFile(user: User, fileId: number) {
    const userId = user.id;
    const staredFileExists = await this.prisma.star.findUnique({
      where: {
        userId_libraryId: {
          userId,
          libraryId: fileId,
        },
      },
    });

    // toggle save
    if (staredFileExists) {
      const [deletedStaredFile] = await this.prisma.$transaction([
        this.prisma.star.delete({
          where: {
            userId_libraryId: {
              userId,
              libraryId: fileId,
            },
          },
        }),
        this.prisma.library.update({
          where: { id: fileId },
          data: {
            stars: {
              increment: -1,
            },
          },
        }),
      ]);

      if (!deletedStaredFile)
        throw new BadRequestException('file unstar failed');
      return {
        message: 'file unstared successfully',
      };
    }

    const file = await this.prisma.library.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new BadRequestException('file not found');
    }

    const [staredFile] = await this.prisma.$transaction([
      this.prisma.star.create({
        data: {
          userId,
          libraryId: fileId,
        },
      }),
      this.prisma.library.update({
        where: { id: fileId },
        data: {
          stars: {
            increment: 1,
          },
        },
      }),
    ]);

    if (!staredFile) {
      throw new BadRequestException('file not stared');
    }

    return {
      id: staredFile.id,
      user: user.id,
      file: file.id,
      message: 'file stared successfully',
    };
  }
}
