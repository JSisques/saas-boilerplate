import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';

/**
 * Interface representing the structure required to create a new tenant database entity.
 *
 * @interface ITenantDatabaseCreateDto
 * @property {TenantDatabaseUuidValueObject} id - The unique identifier for the tenant database.
 * @property {TenantUuidValueObject} tenantId - The unique identifier for the tenant.
 * @property {TenantDatabaseNameValueObject} databaseName - The name of the tenant database.
 * @property {TenantDatabaseNameValueObject} readDatabaseName - The name of the tenant database for read operations.
 * @property {TenantDatabaseStatusValueObject} status - The status of the tenant database.
 * @property {TenantDatabaseSchemaVersionValueObject | null} schemaVersion - The schema version of the tenant database.
 * @property {TenantDatabaseLastMigrationAtValueObject | null} lastMigrationAt - The last migration at of the tenant database.
 * @property {TenantDatabaseErrorMessageValueObject | null} errorMessage - The error message of the tenant database.
 * @property {DateValueObject} createdAt - The created at of the tenant database.
 * @property {DateValueObject} updatedAt - The updated at of the tenant database.
 */
export interface ITenantDatabaseCreateDto extends IBaseAggregateDto {
  id: TenantDatabaseUuidValueObject;
  tenantId: TenantUuidValueObject;
  databaseName: TenantDatabaseNameValueObject;
  readDatabaseName: TenantDatabaseNameValueObject;
  status: TenantDatabaseStatusValueObject;
  schemaVersion: TenantDatabaseSchemaVersionValueObject | null;
  lastMigrationAt: TenantDatabaseLastMigrationAtValueObject | null;
  errorMessage: TenantDatabaseErrorMessageValueObject | null;
}
