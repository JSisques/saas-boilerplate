import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberFindByTenantIdAndUserIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-by-tenant-id-and-user-id/tenant-member-find-by-tenant-id-and-user-id.dto';

export class FindTenantMemberByTenantIdAndUserIdQuery {
  readonly tenantId: TenantUuidValueObject;
  readonly userId: UserUuidValueObject;

  constructor(props: ITenantMemberFindByTenantIdAndUserIdQueryDto) {
    this.tenantId = new TenantUuidValueObject(props.tenantId);
    this.userId = new UserUuidValueObject(props.userId);
  }
}
