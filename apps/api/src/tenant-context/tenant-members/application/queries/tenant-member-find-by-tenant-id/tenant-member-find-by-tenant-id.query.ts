import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantMemberFindByTenantIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-by-tenant-id/tenant-member-find-by-tenant-id.dto';

export class FindTenantMemberByTenantIdQuery {
  readonly tenantId: TenantUuidValueObject;

  constructor(props: ITenantMemberFindByTenantIdQueryDto) {
    this.tenantId = new TenantUuidValueObject(props.id);
  }
}
