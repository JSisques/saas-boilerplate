import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { ITenantMemberFindViewModelByIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-view-model-by-id/tenant-member-find-view-model-by-id.dto';

export class FindTenantMemberViewModelByIdQuery {
  readonly id: TenantMemberUuidValueObject;

  constructor(props: ITenantMemberFindViewModelByIdQueryDto) {
    this.id = new TenantMemberUuidValueObject(props.id);
  }
}
