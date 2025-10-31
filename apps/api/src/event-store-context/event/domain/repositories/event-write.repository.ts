import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { IEventFilterDto } from '@/event-store-context/event/domain/dtos/filters/event-filter.dto';

export const EVENT_WRITE_REPOSITORY_TOKEN = Symbol('EventWriteRepository');

export interface EventWriteRepository {
  findById(id: string): Promise<EventAggregate | null>;
  findByCriteria(filters: IEventFilterDto): Promise<EventAggregate[]>;
  save(event: EventAggregate): Promise<EventAggregate>;
  delete(id: string): Promise<boolean>;
}
