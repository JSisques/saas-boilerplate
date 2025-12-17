import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import {
  FEATURE_READ_REPOSITORY_TOKEN,
  IFeatureReadRepository,
} from '@/feature-context/features/domain/repositories/feature-read.repository';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindFeaturesByCriteriaQuery } from './find-features-by-criteria.query';

@QueryHandler(FindFeaturesByCriteriaQuery)
export class FindFeaturesByCriteriaQueryHandler
  implements IQueryHandler<FindFeaturesByCriteriaQuery>
{
  constructor(
    @Inject(FEATURE_READ_REPOSITORY_TOKEN)
    private readonly featureReadRepository: IFeatureReadRepository,
  ) {}

  async execute(
    query: FindFeaturesByCriteriaQuery,
  ): Promise<PaginatedResult<FeatureViewModel>> {
    return this.featureReadRepository.findByCriteria(query.criteria);
  }
}
