import { Module } from '@nestjs/common';
import { TagController, UserController } from './controllers';
import { TagService, UserService } from './services';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController, TagController],
  providers: [UserService, TagService],
})
export class DashboardModule {}
