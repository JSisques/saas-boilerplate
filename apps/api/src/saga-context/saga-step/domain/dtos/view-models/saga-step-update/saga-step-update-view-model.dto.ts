import { ISagaStepCreateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-create/saga-step-create-view-model.dto';

/**
 * Data Transfer Object for updating a saga step view model.
 *
 * @type ISagaStepUpdateViewModelDto
 * @property {string} name - The name of the saga step.
 * @property {number} order - The order of the saga step.
 * @property {string} status - The status of the saga step.
 * @property {Date | null} startDate - The start date of the saga step.
 * @property {Date | null} endDate - The end date of the saga step.
 * @property {string | null} errorMessage - The error message of the saga step.
 * @property {number} retryCount - The retry count of the saga step.
 * @property {number} maxRetries - The maximum retries of the saga step.
 * @property {any} payload - The payload of the saga step.
 * @property {any} result - The result of the saga step.
 */
export type ISagaStepUpdateViewModelDto = Partial<
  Omit<
    ISagaStepCreateViewModelDto,
    'id' | 'sagaInstanceId' | 'createdAt' | 'updatedAt'
  >
>;
