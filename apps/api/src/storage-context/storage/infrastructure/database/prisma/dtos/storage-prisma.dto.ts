import { StorageProviderEnum } from '@/prisma/tenant/client';
import { BasePrismaDto } from '@/shared/infrastructure/database/prisma/dtos/base-prisma.dto';

export type StoragePrismaDto = BasePrismaDto & {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: StorageProviderEnum;
  url: string;
  path: string;
};
