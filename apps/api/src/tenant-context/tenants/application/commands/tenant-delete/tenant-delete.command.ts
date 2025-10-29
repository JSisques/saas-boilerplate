import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantDeleteCommandDto } from '@/tenant-context/tenants/application/dtos/commands/tenant-delete/tenant-delete-command.dto';

export class TenantDeleteCommand {
  readonly id: TenantUuidValueObject;

  constructor(props: ITenantDeleteCommandDto) {
    this.id = new TenantUuidValueObject(props.id);
  }
}
