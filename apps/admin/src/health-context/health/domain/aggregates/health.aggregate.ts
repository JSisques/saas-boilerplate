import { IHealthCreateDto } from '@/health-context/health/domain/dtos/entities/health-create/health-create.dto';
import { HealthPrimitives } from '@/health-context/health/domain/primitives/health.primitives';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';

export class HealthAggregate {
  private readonly _status: HealthStatusValueObject;
  private readonly _writeDatabaseStatus: HealthStatusValueObject;
  private readonly _readDatabaseStatus: HealthStatusValueObject;

  constructor(props: IHealthCreateDto) {
    this._status = props.status;
    this._writeDatabaseStatus = props.writeDatabaseStatus;
    this._readDatabaseStatus = props.readDatabaseStatus;
  }

  /**
   * Get the status of the health.
   *
   * @returns The status of the health.
   */
  public get status(): HealthStatusValueObject {
    return this._status;
  }

  /**
   * Get the status of the write database.
   *
   * @returns The status of the write database.
   */
  public get writeDatabaseStatus(): HealthStatusValueObject {
    return this._writeDatabaseStatus;
  }

  /**
   * Get the status of the read database.
   *
   * @returns The status of the read database.
   */
  public get readDatabaseStatus(): HealthStatusValueObject {
    return this._readDatabaseStatus;
  }

  /**
   * Convert the health aggregate to primitives.
   *
   * @returns The primitives of the health.
   */
  public toPrimitives(): HealthPrimitives {
    return {
      status: this._status.value,
      writeDatabaseStatus: this._writeDatabaseStatus.value,
      readDatabaseStatus: this._readDatabaseStatus.value,
    };
  }
}
