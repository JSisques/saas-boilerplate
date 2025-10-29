import { Criteria } from '@/shared/domain/entities/criteria';

export class FindAuditsByCriteriaQuery {
  constructor(public readonly criteria: Criteria) {}
}
