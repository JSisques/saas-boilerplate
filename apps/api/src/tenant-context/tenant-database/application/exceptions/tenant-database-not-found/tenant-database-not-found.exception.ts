import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class TenantDatabaseNotFoundException extends BaseApplicationException {
  constructor(tenantDatabaseId: string) {
    super(`Tenant database with id ${tenantDatabaseId} not found`);
  }
}
