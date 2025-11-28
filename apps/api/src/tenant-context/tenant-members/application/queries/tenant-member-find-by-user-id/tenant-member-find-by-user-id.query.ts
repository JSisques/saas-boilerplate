import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberFindByUserIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-by-user-id/tenant-member-find-by-user-id.dto';

export class FindTenantMemberByUserIdQuery {
  readonly userId: UserUuidValueObject;

  constructor(props: ITenantMemberFindByUserIdQueryDto) {
    this.userId = new UserUuidValueObject(props.id);
  }
}


