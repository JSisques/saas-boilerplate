import { IEventCreateDto } from '@/event-store-context/users/domain/dtos/entities/event-create/event-create.dto';

/**
 * Data Transfer Object for updating a event.
 *
 * Allows partial updating of a event entity, excluding the event's immutable identifier (`id`).
 * @type IEventUpdateDto
 * @extends Partial<Omit<IEventCreateDto, 'id'>>
 */
export type IEventUpdateDto = Partial<Omit<IEventCreateDto, 'id'>>;
