import { ISagaStepCreateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-create/saga-step-create.dto';

/**
 * Data Transfer Object for deleting a saga step.
 *
 * Allows deleting a saga step entity by specifying only the saga step's immutable identifier (`id`).
 * @type ISagaStepDeleteDto
 * @property {string} id - The immutable identifier of the saga step to delete.
 */
export type ISagaStepDeleteDto = Pick<ISagaStepCreateDto, 'id'>;
