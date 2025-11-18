import { IEventCreateDto } from '@/event-store-context/users/domain/dtos/entities/event-create/event-create.dto';

/**
 * Data Transfer Object for deleting a event.
 *
 * Allows deleting a event entity by specifying only the event's immutable identifier (`id`).
 * @type IEventDeleteDto
 * @property {EventUuidValueObject} id - The immutable identifier of the event to delete.
 */
export type IEventDeleteDto = Pick<IEventCreateDto, 'id'>;
