import { StorageProviderEnum } from '@prisma/client';

export type StoragePrismaDto = {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: StorageProviderEnum;
  url: string;
  path: string;
};
