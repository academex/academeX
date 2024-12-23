import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database/database.module';
import {
  CommentController,
  PostController,
  ReplyController,
} from './controllers';
import { CommentService, PostService, ReplyService } from './services';
import { StorageModule } from '../storage/storage.module';
import { SavePostService } from './services/save-post.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [PostController, CommentController, ReplyController],
  providers: [PostService, CommentService, ReplyService, SavePostService],
})
export class CommunityModule {}
