import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';
import { StorageProviderEnum } from '@prisma/client';

export type StoragePrismaDto = BasePrismaDto & {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: StorageProviderEnum;
  url: string;
  path: string;
};
