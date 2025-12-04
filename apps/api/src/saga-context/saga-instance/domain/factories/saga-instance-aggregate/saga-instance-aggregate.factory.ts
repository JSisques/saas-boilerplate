import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { ISagaInstanceCreateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-create/saga-instance-create.dto';
import { SagaInstancePrimitives } from '@/saga-context/saga-instance/domain/primitives/saga-instance.primitives';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating SagaInstanceAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate saga instance information.
 */
@Injectable()
export class SagaInstanceAggregateFactory
  implements IWriteFactory<SagaInstanceAggregate, ISagaInstanceCreateDto>
{
  /**
   * Creates a new SagaInstanceAggregate entity using the provided properties.
   *
   * @param data - The saga instance create data.
   * @param data.id - The saga instance id.
   * @param data.name - The saga instance name.
   * @param data.status - The saga instance status.
   * @param data.startDate - The saga instance start date.
   * @param data.endDate - The saga instance end date.
   * @param data.createdAt - The saga instance created at.
   * @param data.updatedAt - The saga instance updated at.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {SagaInstanceAggregate} - The created saga instance aggregate entity.
   */
  public create(
    data: ISagaInstanceCreateDto,
    generateEvent: boolean = true,
  ): SagaInstanceAggregate {
    return new SagaInstanceAggregate(data, generateEvent);
  }

  /**
   * Creates a new SagaInstanceAggregate entity from primitive data.
   *
   * @param data - The saga instance primitive data.
   * @param data.id - The saga instance id.
   * @param data.name - The saga instance name.
   * @param data.status - The saga instance status.
   * @param data.startDate - The saga instance start date.
   * @param data.endDate - The saga instance end date.
   * @param data.createdAt - The saga instance created at.
   * @param data.updatedAt - The saga instance updated at.
   * @returns The created saga instance aggregate entity.
   */
  public fromPrimitives(data: SagaInstancePrimitives): SagaInstanceAggregate {
    return new SagaInstanceAggregate({
      id: new SagaInstanceUuidValueObject(data.id),
      name: new SagaInstanceNameValueObject(data.name),
      status: new SagaInstanceStatusValueObject(data.status),
      startDate: data.startDate
        ? new SagaInstanceStartDateValueObject(data.startDate)
        : null,
      endDate: data.endDate
        ? new SagaInstanceEndDateValueObject(data.endDate)
        : null,
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
