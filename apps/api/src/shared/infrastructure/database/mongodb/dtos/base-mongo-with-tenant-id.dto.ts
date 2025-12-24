import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

export type BaseMongoWithTenantIdDto = BaseMongoDto & {
  tenantId: string;
};
