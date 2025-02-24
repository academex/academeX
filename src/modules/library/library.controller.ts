import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('library')
export class LibraryController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 3 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file) {
          return cb(new BadRequestException('File is required.'), false);
        }
        if (!file.originalname.match(/\.(pdf)$/)) {
          return cb(
            new BadRequestException('Invalid file type. Only pdf is allowed.'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() fileData: CreateFileDto,
    @UserIdentity() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required.');
    }
    return this.fileService.create(fileData, user, file);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto) {
    return this.fileService.update(+id, updateLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
