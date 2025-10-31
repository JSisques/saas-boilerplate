import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const EVENT_READ_REPOSITORY_TOKEN = Symbol('EventReadRepository');

export interface EventReadRepository {
  findById(id: string): Promise<EventViewModel | null>;
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<EventViewModel>>;
  save(eventViewModel: EventViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
