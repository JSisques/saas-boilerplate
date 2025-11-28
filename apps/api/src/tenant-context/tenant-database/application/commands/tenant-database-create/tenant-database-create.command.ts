import { TenantDatabaseStatusEnum } from '@/prisma/master/client';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantDatabaseCreateCommandDto } from '@/tenant-context/tenant-database/application/dtos/commands/tenant-database-create/tenant-database-create-command.dto';
import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

export class TenantDatabaseCreateCommand {
  readonly id: TenantUuidValueObject;
  readonly tenantId: TenantUuidValueObject;
  readonly databaseName: TenantDatabaseNameValueObject;
  readonly readDatabaseName: TenantDatabaseNameValueObject;
  readonly status: TenantDatabaseStatusValueObject;
  readonly schemaVersion: TenantDatabaseSchemaVersionValueObject | null;
  readonly lastMigrationAt: TenantDatabaseLastMigrationAtValueObject | null;
  readonly errorMessage: TenantDatabaseErrorMessageValueObject | null;

  constructor(props: ITenantDatabaseCreateCommandDto) {
    this.id = new TenantUuidValueObject();
    this.tenantId = new TenantUuidValueObject(props.tenantId);
    this.databaseName = new TenantDatabaseNameValueObject(props.databaseName);
    this.readDatabaseName = new TenantDatabaseNameValueObject(
      props.databaseName,
    );
    this.status = new TenantDatabaseStatusValueObject(
      TenantDatabaseStatusEnum.PROVISIONING,
    );
    this.schemaVersion = null;
    this.lastMigrationAt = null;
    this.errorMessage = null;
  }
}
