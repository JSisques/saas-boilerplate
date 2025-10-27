import { Criteria } from '@/shared/domain/entities/criteria';

export class FindAuthsByCriteriaQuery {
  constructor(public readonly criteria: Criteria) {}
}
