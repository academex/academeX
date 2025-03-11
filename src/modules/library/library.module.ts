import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { LibraryController } from './library.controller';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { StarFileService } from './star-file.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [LibraryController],
  providers: [FileService, StarFileService],
})
export class LibraryModule {}
