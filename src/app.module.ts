import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { TagModule } from './modules/tag/tag.module';


@Module({
  imports: [UserModule, DatabaseModule, AuthModule, PostModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
