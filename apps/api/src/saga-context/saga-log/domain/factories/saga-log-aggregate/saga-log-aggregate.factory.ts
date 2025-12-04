import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { ISagaLogCreateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-create/saga-log-create.dto';
import { SagaLogPrimitives } from '@/saga-context/saga-log/domain/primitives/saga-log.primitives';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating SagaLogAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate saga log information.
 */
@Injectable()
export class SagaLogAggregateFactory
  implements IWriteFactory<SagaLogAggregate, ISagaLogCreateDto>
{
  /**
   * Creates a new SagaLogAggregate entity using the provided properties.
   *
   * @param data - The saga log create data.
   * @param data.id - The saga log id.
   * @param data.sagaInstanceId - The saga instance id.
   * @param data.sagaStepId - The saga step id.
   * @param data.type - The saga log type.
   * @param data.message - The saga log message.
   * @param data.createdAt - The saga log created at.
   * @param data.updatedAt - The saga log updated at.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {SagaLogAggregate} - The created saga log aggregate entity.
   */
  public create(
    data: ISagaLogCreateDto,
    generateEvent: boolean = true,
  ): SagaLogAggregate {
    return new SagaLogAggregate(data, generateEvent);
  }

  /**
   * Creates a new SagaLogAggregate entity from primitive data.
   *
   * @param data - The saga log primitive data.
   * @param data.id - The saga log id.
   * @param data.sagaInstanceId - The saga instance id.
   * @param data.sagaStepId - The saga step id.
   * @param data.type - The saga log type.
   * @param data.message - The saga log message.
   * @param data.createdAt - The saga log created at.
   * @param data.updatedAt - The saga log updated at.
   * @returns The created saga log aggregate entity.
   */
  public fromPrimitives(data: SagaLogPrimitives): SagaLogAggregate {
    return new SagaLogAggregate({
      id: new SagaLogUuidValueObject(data.id),
      sagaInstanceId: new SagaInstanceUuidValueObject(data.sagaInstanceId),
      sagaStepId: new SagaStepUuidValueObject(data.sagaStepId),
      type: new SagaLogTypeValueObject(data.type),
      message: new SagaLogMessageValueObject(data.message),
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
