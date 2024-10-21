import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';
import { TagModule } from './modules/tag/tag.module';

//TODO:
//todo (search): how to validate username and the request in other service's functions
//todo (search): how to add Or operator into where statement using prisma
//todo (search): how to make the model prop nullable (not required) in prisma
//todo (search): what's the different between findUnique and findUniqueOrThrow in prisma
//todo (search): add a relationship between the user table and the tag table, one user belong to only one tag, but one tag has many users
//todo (search): add year, gender, phone_number prop to user model

@Module({
  imports: [UserModule, DatabaseModule, AuthModule, PostModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
