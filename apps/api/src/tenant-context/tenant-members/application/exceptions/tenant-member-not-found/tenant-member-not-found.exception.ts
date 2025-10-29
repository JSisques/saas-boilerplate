import { BaseApplicationException } from '@/shared/application/exceptions/base-application.exception';

export class TenantMemberNotFoundException extends BaseApplicationException {
  constructor(tenantMemberId: string) {
    super(`Tenant member with id ${tenantMemberId} not found`);
  }
}
