import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';

export const EVENT_WRITE_REPOSITORY_TOKEN = Symbol('EventWriteRepository');

export interface EventWriteRepository {
  findById(id: string): Promise<EventAggregate | null>;
  save(event: EventAggregate): Promise<EventAggregate>;
  delete(id: string): Promise<boolean>;
}
