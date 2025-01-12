import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { ReactionType, User } from '@prisma/client';
import { UserIdentity } from 'src/common/decorators/user.decorator';
import { PostService } from '../services';
import { CreatePostDto } from '../dto/create-post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/common/validators/file-validation.pipe';
import { ReactToPostDto } from '../dto/react-post.dto';
import { FilterPostsDto } from '../dto/filter-posts.dto';
import { SavePostService } from './../services/save-post.service';
import { PostReactionsDto } from '../dto/post-reactions.dto';
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly savePostService: SavePostService,
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

  @OptionalAuth()
  @Get('popular')
  findPopular(
    @UserIdentity() user: User | undefined,
    @Query() filterPostsDto: FilterPostsDto,
  ) {
    const paginationOptions = this.buildPaginationOptions(filterPostsDto);
    const filteringOptions = this.buildFilteringOptions(filterPostsDto);
    return this.postService.findPopular(
      user,
      paginationOptions,
      filteringOptions,
      filterPostsDto,
    );
  }

  @Post('vote')
  async vote(
    @UserIdentity() user: User,
    @Body('pollId', ParseIntPipe) pollId: number,
    @Body('optionId', ParseIntPipe) optionId: number,
  ) {
    return this.postService.vote(pollId, optionId, user);
  }

  // get all saved posts
  @Get('saved')
  async savedPost(
    @UserIdentity() user: User,
    @Query() filterPostsDto: FilterPostsDto,
  ) {
    const paginationOptions = this.buildPaginationOptions(filterPostsDto);
    return this.savePostService.getSavedPosts(
      user,
      paginationOptions,
      filterPostsDto,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserIdentity() user?: User) {
    return this.postService.findOne(id, user);
  }

  // save / unsave post
  @Get(':id/save')
  async savePost(@UserIdentity() user: User, @Param('id') postId: number) {
    return this.savePostService.savePost(user, postId);
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

  @Get(':id/reactions')
  postReactions(
    @Param('id', ParseIntPipe) postId: number,
    @Query() { type, limit, page }: PostReactionsDto,
  ) {
    const paginationOptions = this.buildPaginationOptions({ page, limit });
    return this.postService.getPostReactions(postId, type, paginationOptions, {
      page,
      limit,
    });
  }

  //! Helper Functions
  buildFilteringOptions(filters: FilterPostsDto) {
    const tagId = parseInt(filters.tagId);
    return { tagId };
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
