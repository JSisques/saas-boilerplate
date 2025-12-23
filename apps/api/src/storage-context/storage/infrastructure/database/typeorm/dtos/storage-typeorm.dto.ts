import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';

export type StorageTypeormDto = {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: StorageProviderEnum;
  url: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
