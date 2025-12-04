import { ISagaStepCreateDto } from '@/saga-context/saga-step/domain/dtos/entities/saga-step-create/saga-step-create.dto';

/**
 * Data Transfer Object for updating a saga step.
 *
 * Allows partial updating of a saga step entity, excluding the saga step's immutable identifier (`id`).
 * @type ISagaStepUpdateDto
 * @extends Partial<Omit<ISagaStepCreateDto, 'id' | 'sagaInstanceId'>>
 */
export type ISagaStepUpdateDto = Partial<
  Omit<ISagaStepCreateDto, 'id' | 'sagaInstanceId'>
>;
