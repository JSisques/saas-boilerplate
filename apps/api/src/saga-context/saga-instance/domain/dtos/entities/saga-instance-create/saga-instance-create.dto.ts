import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

/**
 * Interface representing the structure required to create a new saga instance entity.
 *
 * @interface ISagaInstanceCreateDto
 * @property {SagaInstanceUuidValueObject} id - The unique identifier for the saga instance.
 * @property {SagaInstanceNameValueObject} name - The name of the saga instance.
 * @property {SagaInstanceStatusValueObject} status - The status of the saga instance.
 * @property {SagaInstanceStartDateValueObject} startDate - The start date of the saga instance.
 * @property {SagaInstanceEndDateValueObject} endDate - The end date of the saga instance.
 * @property {DateValueObject} createdAt - The date and time the user was created.
 * @property {DateValueObject} updatedAt - The date and time the user was last updated.
 */
export interface ISagaInstanceCreateDto extends IBaseAggregateDto {
  id: SagaInstanceUuidValueObject;
  name: SagaInstanceNameValueObject;
  status: SagaInstanceStatusValueObject;
  startDate: SagaInstanceStartDateValueObject | null;
  endDate: SagaInstanceEndDateValueObject | null;
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}
