import { ISagaInstanceCreateDto } from '@/saga-context/saga-instance/domain/dtos/entities/saga-instance-create/saga-instance-create.dto';

/**
 * Data Transfer Object for deleting a saga instance.
 *
 * Allows deleting a saga instance entity by specifying only the saga instance's immutable identifier (`id`).
 * @type ISagaInstanceDeleteDto
 * @property {string} id - The immutable identifier of the saga instance to delete.
 */
export type ISagaInstanceDeleteDto = Pick<ISagaInstanceCreateDto, 'id'>;
