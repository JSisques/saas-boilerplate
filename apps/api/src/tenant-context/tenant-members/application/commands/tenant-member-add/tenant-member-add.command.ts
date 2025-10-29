import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberAddCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-add/tenant-member-add-command.dto';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';

export class TenantMemberAddCommand {
  readonly id: TenantUuidValueObject;
  readonly tenantId: TenantUuidValueObject;
  readonly userId: UserUuidValueObject;
  readonly role: TenantMemberRoleValueObject;

  constructor(props: ITenantMemberAddCommandDto) {
    this.id = new TenantUuidValueObject();
    this.tenantId = new TenantUuidValueObject(props.tenantId);
    this.userId = new UserUuidValueObject(props.userId);
    this.role = new TenantMemberRoleValueObject(props.role);
  }
}
