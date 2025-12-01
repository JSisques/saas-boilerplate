import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';

/**
 * Data Transfer Object for changing a saga instance status via command layer.
 *
 * @interface ISagaInstanceChangeStatusCommandDto
 * @property {string} id - The id of the saga instance to change status.
 * @property {SagaInstanceStatusEnum} status - The new status to set.
 */
export interface ISagaInstanceChangeStatusCommandDto {
  id: string;
  status: SagaInstanceStatusEnum;
}
