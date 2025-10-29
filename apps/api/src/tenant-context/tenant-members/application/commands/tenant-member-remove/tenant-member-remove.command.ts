import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { ITenantMemberRemoveCommandDto } from '@/tenant-context/tenant-members/application/dtos/commands/tenant-member-remove/tenant-member-remove-command.dto';

export class TenantMemberRemoveCommand {
  readonly id: TenantMemberUuidValueObject;

  constructor(props: ITenantMemberRemoveCommandDto) {
    this.id = new TenantMemberUuidValueObject(props.id);
  }
}
