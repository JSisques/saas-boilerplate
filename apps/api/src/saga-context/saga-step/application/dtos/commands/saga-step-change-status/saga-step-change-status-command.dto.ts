import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';

/**
 * Data Transfer Object for changing a saga step status via command layer.
 *
 * @interface ISagaStepChangeStatusCommandDto
 * @property {string} id - The id of the saga step to change status.
 * @property {SagaStepStatusEnum} status - The new status to set.
 */
export interface ISagaStepChangeStatusCommandDto {
  id: string;
  status: SagaStepStatusEnum;
}
