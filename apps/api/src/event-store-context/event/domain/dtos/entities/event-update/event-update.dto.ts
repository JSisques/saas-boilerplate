import { IEventCreateDto } from '@/event-store-context/event/domain/dtos/entities/event-create/event-create.dto';

/**
 * Data Transfer Object for updating an event.
 *
 * Allows partial updating of an event entity, excluding the event's immutable identifier (`id`).
 * @interface IEventUpdateDto
 * @extends Partial<Omit<IEventCreateDto, 'id' | 'timestamp'>>
 */
export interface IEventUpdateDto
  extends Partial<Omit<IEventCreateDto, 'id' | 'timestamp'>> {}
