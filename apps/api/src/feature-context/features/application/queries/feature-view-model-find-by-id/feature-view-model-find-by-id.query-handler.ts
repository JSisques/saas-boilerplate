import { FeatureViewModelFindByIdQuery } from '@/feature-context/features/application/queries/feature-view-model-find-by-id/feature-view-model-find-by-id.query';
import { AssertFeatureViewModelExistsService } from '@/feature-context/features/application/services/assert-feature-view-model-exists/assert-feature-view-model-exists.service';
import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FeatureViewModelFindByIdQuery)
export class FeatureViewModelFindByIdQueryHandler
  implements IQueryHandler<FeatureViewModelFindByIdQuery>
{
  private readonly logger = new Logger(
    FeatureViewModelFindByIdQueryHandler.name,
  );

  constructor(
    private readonly assertFeatureViewModelExistsService: AssertFeatureViewModelExistsService,
  ) {}

  /**
   * Executes the FeatureViewModelFindByIdQuery query.
   *
   * @param query - The FeatureViewModelFindByIdQuery query to execute.
   * @returns The FeatureViewModel if found.
   */
  async execute(
    query: FeatureViewModelFindByIdQuery,
  ): Promise<FeatureViewModel> {
    this.logger.log(
      `Executing feature view model find by id query: ${query.id.value}`,
    );

    // 01: Find the feature view model by id
    return await this.assertFeatureViewModelExistsService.execute(
      query.id.value,
    );
  }
}
