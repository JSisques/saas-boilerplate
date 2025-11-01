import { IHealthCreateViewModelDto } from '@/health-context/health/domain/dtos/view-models/health-create/health-create.dto';

export class HealthViewModel {
  private readonly _status: string;

  constructor(props: IHealthCreateViewModelDto) {
    this._status = props.status;
  }

  public get status(): string {
    return this._status;
  }
}
