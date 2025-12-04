import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogsByCriteriaQuery } from './saga-log-find-by-criteria.query';

@QueryHandler(FindSagaLogsByCriteriaQuery)
export class FindSagaLogsByCriteriaQueryHandler
  implements IQueryHandler<FindSagaLogsByCriteriaQuery>
{
  private readonly logger = new Logger(FindSagaLogsByCriteriaQueryHandler.name);

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
  ) {}

  /**
   * Executes the FindSagaLogsByCriteriaQuery query.
   *
   * @param query - The FindSagaLogsByCriteriaQuery query to execute.
   * @returns The PaginatedResult of SagaLogViewModels.
   */
  async execute(
    query: FindSagaLogsByCriteriaQuery,
  ): Promise<PaginatedResult<SagaLogViewModel>> {
    this.logger.log(
      `Executing find saga logs by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the saga logs by criteria
    return this.sagaLogReadRepository.findByCriteria(query.criteria);
  }
}
