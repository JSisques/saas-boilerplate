import { ISagaLogCreateDto } from '@/saga-context/saga-log/domain/dtos/entities/saga-log-create/saga-log-create.dto';

/**
 * Data Transfer Object for updating a saga log.
 *
 * Allows partial updating of a saga log entity, excluding the saga log's immutable identifier (`id`).
 * @type ISagaLogUpdateDto
 * @extends Partial<Omit<ISagaLogCreateDto, 'id' | 'sagaInstanceId' | 'sagaStepId'>>
 */
export type ISagaLogUpdateDto = Partial<
  Omit<ISagaLogCreateDto, 'id' | 'sagaInstanceId' | 'sagaStepId'>
>;
