import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class TenantMemberAlreadyExistsException extends BaseApplicationException {
  constructor(tenantId: string, userId: string) {
    super(
      `Tenant member with tenant id ${tenantId} and user id ${userId} already exists`,
    );
  }
}
