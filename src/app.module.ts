import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TagModule } from './modules/tag/tag.module';
import { CommunityModule } from './modules/community/community.module';
import { LibraryModule } from './modules/library/library.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    CommunityModule,
    AuthModule,
    TagModule,
    LibraryModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
