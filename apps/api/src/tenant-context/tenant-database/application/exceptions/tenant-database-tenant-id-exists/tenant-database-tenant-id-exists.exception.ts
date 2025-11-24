import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class TenantDatabaseTenantIdIsNotUniqueException extends BaseApplicationException {
  constructor(tenantId: string) {
    super(`Tenant database tenant id ${tenantId} is not unique`);
  }
}
