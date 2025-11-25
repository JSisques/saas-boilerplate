import { ITenantDatabaseCreateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-create/tenant-database-create-view-model.dto';
import { ITenantDatabaseUpdateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-update/tenant-database-update-view-model.dto';

/**
 * This class is used to represent a tenant view model.
 */
export class TenantDatabaseViewModel {
  private readonly _id: string;
  private _tenantId: string;
  private _databaseName: string;
  private _readDatabaseName: string;
  private _status: string;
  private _schemaVersion: string | null;
  private _lastMigrationAt: Date | null;
  private _errorMessage: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ITenantDatabaseCreateViewModelDto) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._databaseName = props.databaseName;
    this._readDatabaseName = props.readDatabaseName;
    this._status = props.status;
    this._schemaVersion = props.schemaVersion ?? null;
    this._lastMigrationAt = props.lastMigrationAt ?? null;
    this._errorMessage = props.errorMessage ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  /**
   * Updates the tenant view model with new data
   *
   * @param updateData - The data to update
   * @returns A new TenantViewModel instance with updated data
   */
  public update(updateData: ITenantDatabaseUpdateViewModelDto) {
    this._databaseName =
      updateData.databaseName !== undefined
        ? updateData.databaseName
        : this._databaseName;
    this._readDatabaseName =
      updateData.readDatabaseName !== undefined
        ? updateData.readDatabaseName
        : this._readDatabaseName;
    this._status =
      updateData.status !== undefined ? updateData.status : this._status;
    this._schemaVersion =
      updateData.schemaVersion !== undefined
        ? updateData.schemaVersion
        : this._schemaVersion;
    this._lastMigrationAt =
      updateData.lastMigrationAt !== undefined
        ? updateData.lastMigrationAt
        : this._lastMigrationAt;
    this._errorMessage =
      updateData.errorMessage !== undefined
        ? updateData.errorMessage
        : this._errorMessage;
    this._updatedAt = new Date();
  }

  /**
   * Gets the unique identifier of the tenant database.
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the tenant id of the tenant database.
   * @returns {string}
   */
  get tenantId(): string {
    return this._tenantId;
  }

  /**
   * Gets the database name of the tenant database.
   * @returns {string}
   */
  get databaseName(): string {
    return this._databaseName;
  }
  /**
   * Gets the read database name of the tenant database.
   * @returns {string}
   */
  get readDatabaseName(): string {
    return this._readDatabaseName;
  }

  /**
   * Gets the status of the tenant database.
   * @returns {string}
   */
  get status(): string {
    return this._status;
  }

  /**
   * Gets the schema version of the tenant database.
   * @returns {string}
   */
  get schemaVersion(): string | null {
    return this._schemaVersion;
  }
  /**
   * Gets the last migration at of the tenant database.
   * @returns {Date}
   */
  get lastMigrationAt(): Date | null {
    return this._lastMigrationAt;
  }
  /**
   * Gets the error message of the tenant database.
   * @returns {string}
   */
  get errorMessage(): string | null {
    return this._errorMessage;
  }
  /**
   * Gets the created at of the tenant database.
   * @returns {Date}
   */
  get createdAt(): Date {
    return this._createdAt;
  }
  /**
   * Gets the updated at of the tenant database.
   * @returns {Date}
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
