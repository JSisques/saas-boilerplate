import { FindFeatureByIdQuery } from '@/feature-context/features/application/queries/find-feature-by-id/find-feature-by-id.query';
import { AssertFeatureExistsService } from '@/feature-context/features/application/services/assert-feature-exists/assert-feature-exists.service';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindFeatureByIdQuery)
export class FindFeatureByIdQueryHandler
  implements IQueryHandler<FindFeatureByIdQuery>
{
  private readonly logger = new Logger(FindFeatureByIdQueryHandler.name);

  constructor(
    private readonly assertFeatureExistsService: AssertFeatureExistsService,
  ) {}

  /**
   * Executes the FindFeatureByIdQuery query.
   *
   * @param query - The FindFeatureByIdQuery query to execute.
   * @returns The FeatureAggregate if found.
   */
  async execute(query: FindFeatureByIdQuery): Promise<FeatureAggregate> {
    this.logger.log(`Executing feature find by id query: ${query.id.value}`);

    // 01: Find the feature by id
    return await this.assertFeatureExistsService.execute(query.id.value);
  }
}
