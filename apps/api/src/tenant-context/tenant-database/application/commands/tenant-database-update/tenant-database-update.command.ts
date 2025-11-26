import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { ITenantDatabaseUpdateCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-update/tenant-database-update-command.dto';
import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { TenantDatabaseUrlValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-url/tenant-database-url.vo';

export class TenantDatabaseUpdateCommand {
  readonly id: TenantDatabaseUuidValueObject;
  readonly databaseName?: TenantDatabaseNameValueObject;
  readonly databaseUrl?: TenantDatabaseUrlValueObject;
  readonly status?: TenantDatabaseStatusValueObject;
  readonly schemaVersion?: TenantDatabaseSchemaVersionValueObject;
  readonly lastMigrationAt?: TenantDatabaseLastMigrationAtValueObject;
  readonly errorMessage?: TenantDatabaseErrorMessageValueObject;

  constructor(props: ITenantDatabaseUpdateCommandDto) {
    this.id = new TenantDatabaseUuidValueObject(props.id);

    if (props.databaseName !== undefined) {
      this.databaseName = new TenantDatabaseNameValueObject(props.databaseName);
    }
    if (props.databaseUrl !== undefined) {
      this.databaseUrl = new TenantDatabaseUrlValueObject(props.databaseUrl);
    }
    if (props.status !== undefined) {
      this.status = new TenantDatabaseStatusValueObject(props.status);
    }
    if (props.schemaVersion !== undefined) {
      this.schemaVersion = new TenantDatabaseSchemaVersionValueObject(
        props.schemaVersion,
      );
    }
    if (props.lastMigrationAt !== undefined) {
      this.lastMigrationAt = new TenantDatabaseLastMigrationAtValueObject(
        props.lastMigrationAt,
      );
    }
    if (props.errorMessage !== undefined) {
      this.errorMessage = new TenantDatabaseErrorMessageValueObject(
        props.errorMessage,
      );
    }
  }
}
