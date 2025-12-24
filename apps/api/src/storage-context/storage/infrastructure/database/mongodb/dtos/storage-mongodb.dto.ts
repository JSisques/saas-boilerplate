import { BaseMongoWithTenantIdDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo-with-tenant-id.dto';

export type StorageMongoDbDto = BaseMongoWithTenantIdDto & {
  fileName: string;
  fileSize: number;
  mimeType: string;
  provider: string;
  url: string;
  path: string;
};
