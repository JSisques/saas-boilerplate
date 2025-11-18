import { IHealthCreateViewModelDto } from '@/health-context/health/domain/dtos/view-models/health-create/health-create.dto';

export class HealthViewModel {
  private readonly _status: string;
  private readonly _writeDatabaseStatus: string;
  private readonly _readDatabaseStatus: string;

  constructor(props: IHealthCreateViewModelDto) {
    this._status = props.status;
    this._writeDatabaseStatus = props.writeDatabaseStatus;
    this._readDatabaseStatus = props.readDatabaseStatus;
  }

  public get status(): string {
    return this._status;
  }

  public get writeDatabaseStatus(): string {
    return this._writeDatabaseStatus;
  }

  public get readDatabaseStatus(): string {
    return this._readDatabaseStatus;
  }
}
