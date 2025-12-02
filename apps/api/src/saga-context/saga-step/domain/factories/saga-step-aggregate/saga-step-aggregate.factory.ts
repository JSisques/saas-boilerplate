import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { ISagaStepCreateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-create/saga-step-create.dto';
import { SagaStepPrimitives } from '@/saga-context/saga-step/domain/primitives/saga-step.primitives';
import { SagaStepEndDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-end-date/saga-step-end-date.vo';
import { SagaStepErrorMessageValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-error-message/saga-step-error-message.vo';
import { SagaStepMaxRetriesValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-max-retries/saga-step-max-retries.vo';
import { SagaStepNameValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-name/saga-step-name.vo';
import { SagaStepOrderValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-order/saga-step-order.vo';
import { SagaStepPayloadValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-payload/saga-step-payload.vo';
import { SagaStepResultValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-result/saga-step-result.vo';
import { SagaStepRetryCountValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-retry-count/saga-step-retry-count.vo';
import { SagaStepStartDateValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-start-date/saga-step-start-date.vo';
import { SagaStepStatusValueObject } from '@/saga-context/saga-step/domain/value-objects/saga-step-status/saga-step-status.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating SagaInstanceAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate saga instance information.
 */
@Injectable()
export class SagaStepAggregateFactory
  implements IWriteFactory<SagaStepAggregate, ISagaStepCreateDto>
{
  /**
   * Creates a new SagaStepAggregate entity using the provided properties.
   *
   * @param data - The saga step create data.
   * @param data.id - The saga step id.
   * @param data.sagaInstanceId - The saga instance id.
   * @param data.name - The saga step name.
   * @param data.order - The saga step order.
   * @param data.status - The saga step status.
   * @param data.startDate - The saga step start date.
   * @param data.generateEvent - Whether to generate a creation event (default: true).
   * @param data.endDate - The saga step end date.
   * @param data.errorMessage - The saga step error message.
   * @param data.retryCount - The saga step retry count.
   * @param data.maxRetries - The saga step max retries.
   * @param data.payload - The saga step payload.
   * @param data.result - The saga step result.
   * @param data.createdAt - The saga step created at.
   * @param data.updatedAt - The saga step updated at.
   * @returns {SagaStepAggregate} - The created saga step aggregate entity.
   */
  public create(
    data: ISagaStepCreateDto,
    generateEvent: boolean = true,
  ): SagaStepAggregate {
    return new SagaStepAggregate(data, generateEvent);
  }

  /**
   * Creates a new SagaStepAggregate entity from primitive data.
   *
   * @param data - The saga step primitive data.
   * @param data.id - The saga step id.
   * @param data.sagaInstanceId - The saga instance id.
   * @param data.name - The saga step name.
   * @param data.order - The saga step order.
   * @param data.status - The saga step status.
   * @param data.startDate - The saga step start date.
   * @param data.endDate - The saga step end date.
   * @param data.errorMessage - The saga step error message.
   * @param data.retryCount - The saga step retry count.
   * @param data.maxRetries - The saga step max retries.
   * @param data.payload - The saga step payload.
   * @param data.result - The saga step result.
   * @param data.createdAt - The saga step created at.
   * @param data.updatedAt - The saga step updated at.
   * @returns The created saga step aggregate entity.
   */
  public fromPrimitives(data: SagaStepPrimitives): SagaStepAggregate {
    return new SagaStepAggregate({
      id: new SagaStepUuidValueObject(data.id),
      sagaInstanceId: new SagaInstanceUuidValueObject(data.sagaInstanceId),
      name: new SagaStepNameValueObject(data.name),
      order: new SagaStepOrderValueObject(data.order),
      status: new SagaStepStatusValueObject(data.status),
      startDate: new SagaStepStartDateValueObject(data.startDate),
      endDate: new SagaStepEndDateValueObject(data.endDate),
      errorMessage: new SagaStepErrorMessageValueObject(data.errorMessage),
      retryCount: new SagaStepRetryCountValueObject(data.retryCount),
      maxRetries: new SagaStepMaxRetriesValueObject(data.maxRetries),
      payload: new SagaStepPayloadValueObject(data.payload),
      result: new SagaStepResultValueObject(data.result),
      createdAt: new DateValueObject(data.createdAt),
      updatedAt: new DateValueObject(data.updatedAt),
    });
  }
}
