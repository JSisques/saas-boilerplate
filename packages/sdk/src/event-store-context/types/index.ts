import type {
  FindByCriteriaInput,
  PaginatedResult,
} from '@/shared/types/index';

export type EventResponse = {
  id: string;
  eventType?: string;
  aggregateType?: string;
  aggregateId?: string;
  payload?: string;
  timestamp?: string;
};

export type EventFindByCriteriaInput = FindByCriteriaInput;
export type PaginatedEventResult = PaginatedResult<EventResponse>;
