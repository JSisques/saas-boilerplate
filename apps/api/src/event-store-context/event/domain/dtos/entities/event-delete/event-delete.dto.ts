import { IEventCreateDto } from '@/event-store-context/event/domain/dtos/entities/event-create/event-create.dto';

/**
 * Data Transfer Object for deleting an event.
 *
 * Allows deleting an event entity by specifying only the event's immutable identifier (`id`).
 * @type IEventDeleteDto
 * @property {string} id - The immutable identifier of the event to delete.
 */
export type IEventDeleteDto = Pick<IEventCreateDto, 'id'>;
