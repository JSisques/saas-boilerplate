import { StorageModule } from '@/storage-context/storage/storage.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [StorageModule],
})
export class StorageContextModule {}
