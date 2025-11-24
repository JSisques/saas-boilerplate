import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { ITenantDatabaseCreateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-create/tenant-database-create.dto';
import { TenantDatabasePrimitives } from '@/tenant-context/tenant-database/domain/primitives/tenant-database.primitives';
import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { TenantDatabaseUrlValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-url/tenant-database-url.vo';
import { Injectable } from '@nestjs/common';

/**
 * Tenant database aggregate factory class responsible for creating TenantDatabaseAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate tenant database information.
 */
@Injectable()
export class TenantDatabaseAggregateFactory
  implements IWriteFactory<TenantDatabaseAggregate, ITenantDatabaseCreateDto>
{
  /**
   * Creates a new TenantDatabaseAggregate entity using the provided propertie  s.
   *
   * @param data - The tenant database create data.
   * @param data.id - The tenant database id.
   * @param data.tenantId - The tenant id.
   * @param data.databaseName - The database name.
   * @param data.databaseUrl - The database URL.
   * @param data.status - The database status.
   * @param data.schemaVersion - The database schema version.
   * @param data.lastMigrationAt - The database last migration at.
   * @param data.errorMessage - The database error message.
   * @param data.createdAt - The tenant database created at.
   * @param data.updatedAt - The tenant database updated at.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {TenantDatabaseAggregate} - The created tenant database aggregate entity.
   */
  public create(
    data: ITenantDatabaseCreateDto,
    generateEvent: boolean = true,
  ): TenantDatabaseAggregate {
    return new TenantDatabaseAggregate(data, generateEvent);
  }

  /**
   * Creates a new TenantDatabaseAggregate entity from primitive data.
   *
   * @param data - The tenant primitive data.
   * @param data.id - The tenant database id.
   * @param data.tenantId - The tenant id.
   * @param data.databaseName - The database name.
   * @param data.databaseUrl - The database URL.
   * @param data.status - The database status.
   * @param data.schemaVersion - The database schema version.
   * @param data.lastMigrationAt - The database last migration at.
   * @param data.errorMessage - The database error message.
   * @param data.createdAt - The tenant database created at.
   * @param data.updatedAt - The tenant database updated at.
   * @returns The created tenant database aggregate entity.
   */
  public fromPrimitives(
    data: TenantDatabasePrimitives,
  ): TenantDatabaseAggregate {
    return new TenantDatabaseAggregate({
      id: new TenantMemberUuidValueObject(data.id),
      tenantId: new TenantUuidValueObject(data.tenantId),
      databaseName: new TenantDatabaseNameValueObject(data.databaseName),
      databaseUrl: new TenantDatabaseUrlValueObject(data.databaseUrl),
      status: new TenantDatabaseStatusValueObject(data.status),
      schemaVersion: data.schemaVersion
        ? new TenantDatabaseSchemaVersionValueObject(data.schemaVersion)
        : null,
      lastMigrationAt: data.lastMigrationAt
        ? new TenantDatabaseLastMigrationAtValueObject(data.lastMigrationAt)
        : null,
      errorMessage: data.errorMessage
        ? new TenantDatabaseErrorMessageValueObject(data.errorMessage)
        : null,
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
