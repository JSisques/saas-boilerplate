import { ISubscriptionFindByTenantIdQueryDto } from '@/billing-context/subscription/application/dtos/queries/subscription-find-by-tenant-id/subscription-find-by-tenant-id-query.dto';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';

export class FindSubscriptionByTenantIdQuery {
  readonly tenantId: TenantUuidValueObject;

  constructor(props: ISubscriptionFindByTenantIdQueryDto) {
    this.tenantId = new TenantUuidValueObject(props.tenantId);
  }
}
