import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  ParseEnumPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ReactionType, User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { PostService } from '../services';
import { CreatePostDto } from '../dto/create-post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/validators/file-validation.pipe';
import { StorageService } from 'src/modules/storage/storage.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 5 },
      { name: 'file', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles(new FileValidationPipe())
    uploads: { images?: Express.Multer.File[]; file?: Express.Multer.File[] },
    @Body() createPostDto: CreatePostDto,
    @UserIdentity() user: User,
  ) {
    return this.postService.create(createPostDto, user, uploads);
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
