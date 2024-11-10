import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ParseEnumPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipeBuilder,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, ReactionType, User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { Public } from 'src/common/decorators/access.decorator';
import { PostService } from '../services';
import { CreatePostDto } from '../dto/create-post.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/validators/file-validation.pipe';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //todo: make files and image optional
  //todo: add type validation
  //todo: fix file size validation (not working)
  //todo: create a service file named uploader, in utils folder.
  // this file's func single take the image buffer and upload it on supabase
  // this file's func multiple take the images buffer and upload them on supabase

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 3 },
      { name: 'file', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles(new FileValidationPipe())
    uploads: { images?: Express.Multer.File[]; file?: Express.Multer.File[] },
    @Body() createPostDto: CreatePostDto,
    @UserIdentity() user: User,
  ) {
    // console.log(uploads);
    return this.postService.create(createPostDto, user);
  }

  //todo: get the query param and named it tag, if it's exists return tag's posts, if not return the user's tag's post.
  @Get()
  findAll(@UserIdentity() user: User) {
    return this.postService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Post(':id/react')
  reactToPost(
    @Param('id', ParseIntPipe) postId: number,
    @UserIdentity() user: User,
    @Body('type', new ParseEnumPipe(ReactionType)) type,
  ) {
    return this.postService.reactToPost(postId, user, type);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
