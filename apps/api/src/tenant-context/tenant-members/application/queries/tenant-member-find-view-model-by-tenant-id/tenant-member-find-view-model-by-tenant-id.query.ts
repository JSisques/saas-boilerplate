import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantMemberViewModelFindByTenantIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-view-model-find-by-tenant-id/tenant-member-view-model-find-by-tenant-id.dto';

export class FindTenantMemberViewModelByTenantIdQuery {
  readonly tenantId: TenantUuidValueObject;

  constructor(props: ITenantMemberViewModelFindByTenantIdQueryDto) {
    this.tenantId = new TenantUuidValueObject(props.id);
  }
}
