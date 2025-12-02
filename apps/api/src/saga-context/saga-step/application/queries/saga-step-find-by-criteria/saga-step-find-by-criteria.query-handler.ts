import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaStepsByCriteriaQuery } from './saga-step-find-by-criteria.query';

@QueryHandler(FindSagaStepsByCriteriaQuery)
export class FindSagaStepsByCriteriaQueryHandler
  implements IQueryHandler<FindSagaStepsByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindSagaStepsByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
  ) {}

  /**
   * Executes the FindSagaStepsByCriteriaQuery query.
   *
   * @param query - The FindSagaStepsByCriteriaQuery query to execute.
   * @returns The PaginatedResult of SagaStepViewModels.
   */
  async execute(
    query: FindSagaStepsByCriteriaQuery,
  ): Promise<PaginatedResult<SagaStepViewModel>> {
    this.logger.log(
      `Executing find saga steps by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the saga steps by criteria
    return this.sagaStepReadRepository.findByCriteria(query.criteria);
  }
}
