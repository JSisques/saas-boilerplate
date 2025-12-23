import { Criteria } from '@/shared/domain/entities/criteria';

export class FindFeaturesByCriteriaQuery {
  constructor(public readonly criteria: Criteria) {}
}
