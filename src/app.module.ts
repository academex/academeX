import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TagModule } from './modules/tag/tag.module';
import { CommunityModule } from './modules/community/community.module';

@Module({
  imports: [UserModule, DatabaseModule, CommunityModule, AuthModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
