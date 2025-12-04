import { ISagaLogCreateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-create/saga-log-create-view-model.dto';

/**
 * Data Transfer Object for updating a saga log view model.
 *
 * @type ISagaLogUpdateViewModelDto
 * @property {string} type - The type of the saga log.
 * @property {string} message - The message of the saga log.
 */
export type ISagaLogUpdateViewModelDto = Partial<
  Omit<
    ISagaLogCreateViewModelDto,
    'id' | 'sagaInstanceId' | 'sagaStepId' | 'createdAt' | 'updatedAt'
  >
>;
