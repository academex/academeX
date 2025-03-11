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
  Query,
  ParseIntPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { LibraryType, User } from '@prisma/client';
import { FilterFilesDto } from './dto/filter-files.dto';
import { StarFileService } from './star-file.service';
import { FilterTypedFilesDto } from './dto/filter-typed-files.dto';

@Controller('library')
export class LibraryController {
  constructor(
    private readonly fileService: FileService,
    private readonly starFileService: StarFileService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 3 * 1024 * 1024, files: 1 },
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
  findAll(@UserIdentity() user: User, @Query() filterFilesDto: FilterFilesDto) {
    const filteringOptions = this.buildFilteringOptions(filterFilesDto);

    return this.fileService.findAll(user, filteringOptions);
  }

  @Get('type/:type')
  getFilesByType(
    @UserIdentity() user: User,
    @Query() filterTypedFilesDto: FilterTypedFilesDto,
    @Param('type', new ParseEnumPipe(LibraryType)) type: LibraryType,
  ) {
    const filteringOptions = this.buildFilteringOptions(filterTypedFilesDto);
    const paginationOptions = this.buildPaginationOptions(filterTypedFilesDto);

    return this.fileService.getFilesByType(
      user,
      filteringOptions,
      paginationOptions,
      filterTypedFilesDto,
      type,
    );
  }

  @Get(':id/star')
  starFile(
    @UserIdentity() user: User,
    @Param('id', ParseIntPipe) fileId: number,
  ) {
    return this.starFileService.starFile(user, fileId);
  }

  //! Helper Functions
  buildFilteringOptions(filters: FilterFilesDto | FilterTypedFilesDto) {
    const tagId = parseInt(filters.tagId);
    const yearNum = filters.yearNum;
    return { tagId, yearNum };
  }
  buildPaginationOptions({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const take = limit;

    return {
      skip,
      take,
    };
  }
}
