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
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

/**
 * Interface representing the structure required to create a new saga step entity.
 *
 * @interface ISagaStepCreateDto
 * @property {SagaStepUuidValueObject} id - The unique identifier for the saga step.
 * @property {SagaInstanceUuidValueObject} sagaInstanceId - The unique identifier for the saga instance.
 * @property {SagaStepNameValueObject} name - The name of the saga step.
 * @property {SagaStepOrderValueObject} order - The order of the saga step.
 * @property {SagaStepStatusValueObject} status - The status of the saga step.
 * @property {SagaStepStartDateValueObject | null} startDate - The start date of the saga step.
 * @property {SagaStepEndDateValueObject | null} endDate - The end date of the saga step.
 * @property {SagaStepErrorMessageValueObject | null} errorMessage - The error message of the saga step.
 * @property {SagaStepRetryCountValueObject} retryCount - The retry count of the saga step.
 * @property {SagaStepMaxRetriesValueObject} maxRetries - The maximum retries of the saga step.
 * @property {SagaStepPayloadValueObject} payload - The payload of the saga step.
 * @property {SagaStepResultValueObject} result - The result of the saga step.
 * @property {DateValueObject} createdAt - The date and time the saga step was created.
 * @property {DateValueObject} updatedAt - The date and time the saga step was last updated.
 */
export interface ISagaStepCreateDto extends IBaseAggregateDto {
  id: SagaStepUuidValueObject;
  sagaInstanceId: SagaInstanceUuidValueObject;
  name: SagaStepNameValueObject;
  order: SagaStepOrderValueObject;
  status: SagaStepStatusValueObject;
  startDate: SagaStepStartDateValueObject | null;
  endDate: SagaStepEndDateValueObject | null;
  errorMessage: SagaStepErrorMessageValueObject | null;
  retryCount: SagaStepRetryCountValueObject;
  maxRetries: SagaStepMaxRetriesValueObject;
  payload: SagaStepPayloadValueObject;
  result: SagaStepResultValueObject;
}
