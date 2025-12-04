import { ISagaInstanceCreateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-create/saga-instance-create-view-model.dto';

/**
 * Data Transfer Object for updating a saga instance view model.
 *
 * @type ISagaInstanceUpdateViewModelDto
 * @property {string} name - The name of the saga instance.
 * @property {string} status - The status of the saga instance.
 * @property {Date | null} startDate - The start date of the saga instance.
 * @property {Date | null} endDate - The end date of the saga instance.
 * @property {Date} createdAt - Timestamp when the saga instance was created.
 * @property {Date} updatedAt - Timestamp when the saga instance was last updated.
 */
export type ISagaInstanceUpdateViewModelDto = Partial<
  Omit<ISagaInstanceCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
>;
