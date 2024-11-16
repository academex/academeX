import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  providers: [StorageService, SupabaseService],
  exports: [StorageService],
})
export class StorageModule {}
