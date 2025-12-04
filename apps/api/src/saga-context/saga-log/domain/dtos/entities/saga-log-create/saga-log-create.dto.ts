import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

/**
 * Interface representing the structure required to create a new saga log entity.
 *
 * @interface ISagaLogCreateDto
 * @property {SagaLogUuidValueObject} id - The unique identifier for the saga log.
 * @property {SagaInstanceUuidValueObject} sagaInstanceId - The unique identifier for the saga instance.
 * @property {SagaStepUuidValueObject} sagaStepId - The unique identifier for the saga step.
 * @property {SagaLogTypeValueObject} type - The type of the saga log.
 * @property {SagaLogMessageValueObject} message - The message of the saga log.
 * @property {DateValueObject} createdAt - The date and time the saga log was created.
 * @property {DateValueObject} updatedAt - The date and time the saga log was last updated.
 */
export interface ISagaLogCreateDto extends IBaseAggregateDto {
  id: SagaLogUuidValueObject;
  sagaInstanceId: SagaInstanceUuidValueObject;
  sagaStepId: SagaStepUuidValueObject;
  type: SagaLogTypeValueObject;
  message: SagaLogMessageValueObject;
}
