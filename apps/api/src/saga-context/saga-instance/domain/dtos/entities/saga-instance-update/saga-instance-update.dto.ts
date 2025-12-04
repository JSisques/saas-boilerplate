import { ISagaInstanceCreateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-create/saga-instance-create.dto';

/**
 * Data Transfer Object for updating a saga instance.
 *
 * Allows partial updating of a saga instance entity, excluding the saga instance's immutable identifier (`id`).
 * @type ISagaInstanceUpdateDto
 * @extends Partial<Omit<ISagaInstanceCreateDto, 'id'>>
 */
export type ISagaInstanceUpdateDto = Partial<
  Omit<ISagaInstanceCreateDto, 'id'>
>;
