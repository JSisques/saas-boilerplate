import { Pagination } from '@/shared/domain/entities/criteria';

export interface IEventFilterDto {
  id?: string;
  eventType: string;
  aggregateId?: string;
  aggregateType?: string;
  from: Date;
  to: Date;
  pagination?: Pagination;
}
