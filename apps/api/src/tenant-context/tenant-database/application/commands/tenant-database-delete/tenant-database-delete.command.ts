import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { ITenantDatabaseDeleteCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-delete/tenant-database-delete-command.dto';

export class TenantDatabaseDeleteCommand {
  readonly id: TenantDatabaseUuidValueObject;

  constructor(props: ITenantDatabaseDeleteCommandDto) {
    this.id = new TenantDatabaseUuidValueObject(props.id);
  }
}
