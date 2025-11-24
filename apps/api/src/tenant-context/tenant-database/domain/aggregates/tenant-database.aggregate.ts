import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { TenantDatabaseCreatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-created/tenant-database-created.event';
import { TenantDatabaseDeletedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-deleted/tenant-database-deleted.event';
import { TenantDatabaseUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-database/tenant-database-updated/tenant-database-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantDatabaseCreateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-create/tenant-database-create.dto';
import { ITenantDatabaseUpdateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-update/tenant-database-update.dto';
import { TenantDatabasePrimitives } from '@/tenant-context/tenant-database/domain/primitives/tenant-database.primitives';
import { TenantDatabaseErrorMessageValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-error-message/tenant-database-error-message.vo';
import { TenantDatabaseLastMigrationAtValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-last-migration-at/tenant-database-last-migration-at.vo';
import { TenantDatabaseNameValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-name/tenant-database-name.vo';
import { TenantDatabaseSchemaVersionValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-schema-version/tenant-database-schema-version.vo';
import { TenantDatabaseStatusValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-status/tenant-database-status.vo';
import { TenantDatabaseUrlValueObject } from '@/tenant-context/tenant-database/domain/value-objects/tenant-database-url/tenant-database-url.vo';

export class TenantDatabaseAggregate extends BaseAggregate {
  private readonly _id: TenantDatabaseUuidValueObject;
  private _tenantId: TenantUuidValueObject;
  private _databaseName: TenantDatabaseNameValueObject;
  private _databaseUrl: TenantDatabaseUrlValueObject;
  private _status: TenantDatabaseStatusValueObject;
  private _schemaVersion: TenantDatabaseSchemaVersionValueObject | null;
  private _lastMigrationAt: TenantDatabaseLastMigrationAtValueObject | null;
  private _errorMessage: TenantDatabaseErrorMessageValueObject | null;

  constructor(props: ITenantDatabaseCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);

    // 01: Set the properties
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._databaseName = props.databaseName;
    this._databaseUrl = props.databaseUrl;
    this._status = props.status;
    this._schemaVersion = props.schemaVersion;
    this._lastMigrationAt = props.lastMigrationAt;
    this._errorMessage = props.errorMessage;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new TenantDatabaseCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantDatabaseAggregate.name,
            eventType: TenantDatabaseCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the tenant database.
   *
   * @param props - The properties to update the tenant database.
   * @param props.databaseName - The name of the tenant database.
   * @param props.databaseUrl - The URL of the tenant database.
   * @param props.status - The status of the tenant database.
   * @param props.schemaVersion - The schema version of the tenant database.
   * @param props.lastMigrationAt - The last migration at of the tenant database.
   * @param props.errorMessage - The error message of the tenant database.
   */
  public update(
    props: ITenantDatabaseUpdateDto,
    generateEvent: boolean = true,
  ) {
    // 01: Update the properties
    this._databaseName =
      props.databaseName !== undefined
        ? props.databaseName
        : this._databaseName;
    this._databaseUrl =
      props.databaseUrl !== undefined ? props.databaseUrl : this._databaseUrl;
    this._status = props.status !== undefined ? props.status : this._status;
    this._schemaVersion =
      props.schemaVersion !== undefined
        ? props.schemaVersion
        : this._schemaVersion;
    this._lastMigrationAt =
      props.lastMigrationAt !== undefined
        ? props.lastMigrationAt
        : this._lastMigrationAt;
    this._errorMessage =
      props.errorMessage !== undefined
        ? props.errorMessage
        : this._errorMessage;

    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new TenantDatabaseUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantDatabaseAggregate.name,
            eventType: TenantDatabaseUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the tenant database.
   *
   * @param generateEvent - Whether to generate the tenant database deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new TenantDatabaseDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantDatabaseAggregate.name,
            eventType: TenantDatabaseDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Get the id of the tenant database.
   *
   * @returns The id of the tenant database.
   */
  public get id(): TenantUuidValueObject {
    return this._id;
  }

  /**
   * Get the tenant id of the tenant database.
   *
   * @returns The tenant id of the tenant database.
   */
  public get tenantId(): TenantUuidValueObject {
    return this._tenantId;
  }

  /**
   * Get the database name of the tenant database.
   *
   * @returns The database name of the tenant database.
   */
  public get databaseName(): TenantDatabaseNameValueObject {
    return this._databaseName;
  }

  /**
   * Get the database URL of the tenant database.
   *
   * @returns The database URL of the tenant database.
   */
  public get databaseUrl(): TenantDatabaseUrlValueObject {
    return this._databaseUrl;
  }

  /**
   * Get the status of the tenant database.
   *
   * @returns The status of the tenant database.
   */
  public get status(): TenantDatabaseStatusValueObject {
    return this._status;
  }

  /**
   * Get the schema version of the tenant database.
   *
   * @returns The schema version of the tenant database.
   */
  public get schemaVersion(): TenantDatabaseSchemaVersionValueObject | null {
    return this._schemaVersion;
  }

  /**
   * Get the last migration at of the tenant database.
   *
   * @returns The last migration at of the tenant database.
   */
  public get lastMigrationAt(): TenantDatabaseLastMigrationAtValueObject | null {
    return this._lastMigrationAt;
  }

  /**
   * Get the error message of the tenant database.
   *
   * @returns The error message of the tenant database.
   */
  public get errorMessage(): TenantDatabaseErrorMessageValueObject | null {
    return this._errorMessage;
  }

  /**
   * Convert the tenant database aggregate to primitives.
   *
   * @returns The primitives of the tenant database.
   */
  public toPrimitives(): TenantDatabasePrimitives {
    return {
      id: this._id.value,
      tenantId: this._tenantId.value,
      databaseName: this._databaseName.value,
      databaseUrl: this._databaseUrl.value,
      status: this._status.value,
      schemaVersion: this._schemaVersion?.value ?? null,
      lastMigrationAt: this._lastMigrationAt?.value ?? null,
      errorMessage: this._errorMessage?.value ?? null,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
