import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { ITenantMemberFindByIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-by-id/tenant-member-find-by-id.dto';

export class FindTenantMemberByIdQuery {
  readonly id: TenantMemberUuidValueObject;

  constructor(props: ITenantMemberFindByIdQueryDto) {
    this.id = new TenantMemberUuidValueObject(props.id);
  }
}
