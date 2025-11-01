import { IHealthCreateDto } from '@/health-context/health/domain/dtos/entities/health-create/health-create.dto';
import { HealthPrimitives } from '@/health-context/health/domain/primitives/health.primitives';
import { HealthStatusValueObject } from '@/health-context/health/domain/value-objects/health-status/health-status.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class HealthAggregate extends AggregateRoot {
  private readonly _status: HealthStatusValueObject;

  constructor(props: IHealthCreateDto) {
    super();

    this._status = props.status;
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
   * Convert the health aggregate to primitives.
   *
   * @returns The primitives of the health.
   */
  public toPrimitives(): HealthPrimitives {
    return {
      status: this._status.value,
    };
  }
}
