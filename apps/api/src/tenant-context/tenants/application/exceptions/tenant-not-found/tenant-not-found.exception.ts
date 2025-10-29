import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class TenantNotFoundException extends BaseApplicationException {
  constructor(tenantId: string) {
    super(`Tenant with id ${tenantId} not found`);
  }
}
