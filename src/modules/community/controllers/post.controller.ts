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
  Query,
  Delete,
} from '@nestjs/common';
import { ReactionType, User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { PostService } from '../services';
import { CreatePostDto } from '../dto/create-post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/validators/file-validation.pipe';
import { StorageService } from 'src/modules/storage/storage.service';
import { ReactToPostDto } from '../dto/react-post.dto';
import { FilterPostsDto } from '../dto/filter-posts.dto';

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

  @Get()
  findAll(@UserIdentity() user: User, @Query() filterPostsDto: FilterPostsDto) {
    const paginationOptions = this.buildPaginationOptions(filterPostsDto);
    const filteringOptions = this.buildFilteringOptions(filterPostsDto);
    return this.postService.findAll(
      user,
      paginationOptions,
      filteringOptions,
      filterPostsDto,
    );
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }



  //! React to post
  @Post(':id/react')
  reactToPost(
    @Param('id', ParseIntPipe) postId: number,
    @UserIdentity() user: User,
    @Body() { type }: ReactToPostDto,
  ) {
    return this.postService.reactToPost(postId, user, type);
  }

  //! Helper Functions
  buildFilteringOptions(filters: FilterPostsDto) {
    const tagId = parseInt(filters.tagId);
    return { tagId };
  }
  buildPaginationOptions({ page, limit }: FilterPostsDto) {
    // const page = parseInt(filters.page) || 1;
    // const limit = parseInt(filters.limit) || 10;

    const skip = (page - 1) * limit;
    const take = limit;

    return {
      skip,
      take,
    };
  }
}
