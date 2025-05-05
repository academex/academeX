import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/access.decorator';
import { Role, User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { TagService } from '../tag.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTagDto } from '../dto/create-tag.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTagDto } from '../dto/update-tag.dto';

@Roles(Role.ADMIN)
@Controller('admin/tag')
export class TagAdminController {
  constructor(private readonly tagService: TagService) {}

  // , {
  //   limits: { fileSize: 2 * 1024 * 1024 },
  //   fileFilter: (req, file, cb) => {
  //     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //       return cb(
  //         new BadRequestException(
  //           'Invalid file type. Only JPG, PNG, and jpeg are allowed.',
  //         ),
  //         false,
  //       );
  //     }
  //     cb(null, true);
  //   },
  // }
  @Post()
  @UseInterceptors(FileInterceptor('photoUrl'))
  createTag(
    @Body() data: CreateTagDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    photoUrl: Express.Multer.File,
    @UserIdentity() admin: User,
  ) {
    return this.tagService.create(admin, data, photoUrl);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photoUrl'))
  updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTagDto,
    @UserIdentity() admin: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    photoUrl: Express.Multer.File,
  ) {
    return this.tagService.update(admin, data, photoUrl, id);
  }

  @Patch(':id/activate')
  activateTag(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() admin: User,
  ) {
    return this.tagService.toggleTagActivation(id, admin, true);
  }

  @Patch(':id/deactivate')
  deactivateTag(
    @Param('id', ParseIntPipe) id: number,
    @UserIdentity() admin: User,
  ) {
    return this.tagService.toggleTagActivation(id, admin, false);
  }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.tagService.remove(id);
  // }
}
