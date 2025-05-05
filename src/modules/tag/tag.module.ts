import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { DatabaseModule } from '../database/database.module';
import { TagAdminController, TagController } from './controllers';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [TagController, TagAdminController],
  providers: [TagService],
})
export class TagModule {}
