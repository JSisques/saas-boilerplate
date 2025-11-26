import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SubscriptionTenantIdAlreadyExistsException extends BaseApplicationException {
  constructor(tenantId: string) {
    super(`Subscription with tenant id ${tenantId} already exists`);
  }
}
