import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController, CommentController, ReplyController],
  providers: [PostService, CommentService, ReplyService],
})
export class PostModule {}
