import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { LibraryController } from './library.controller';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [LibraryController],
  providers: [FileService],
})
export class LibraryModule {}
