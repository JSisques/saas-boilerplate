import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { ITenantMemberUpdateCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-update/tenant-member-update-command.dto';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';

export class TenantMemberUpdateCommand {
  readonly id: TenantMemberUuidValueObject;
  readonly role?: TenantMemberRoleValueObject;

  constructor(props: ITenantMemberUpdateCommandDto) {
    this.id = new TenantMemberUuidValueObject(props.id);

    if (props.role !== undefined) {
      this.role = new TenantMemberRoleValueObject(props.role);
    }
  }
}
