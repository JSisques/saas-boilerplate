import { Criteria } from '@/shared/domain/entities/criteria';

export class FindUsersByCriteriaQuery {
  constructor(public readonly criteria: Criteria) {}
}
