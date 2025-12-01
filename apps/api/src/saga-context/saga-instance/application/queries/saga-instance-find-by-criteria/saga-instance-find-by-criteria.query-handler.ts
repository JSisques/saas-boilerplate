import { FindSagaInstancesByCriteriaQuery } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindSagaInstancesByCriteriaQuery)
export class FindSagaInstancesByCriteriaQueryHandler
  implements IQueryHandler<FindSagaInstancesByCriteriaQuery>
{
  private readonly logger = new Logger(
    FindSagaInstancesByCriteriaQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_INSTANCE_READ_REPOSITORY_TOKEN)
    private readonly sagaInstanceReadRepository: SagaInstanceReadRepository,
  ) {}

  /**
   * Executes the FindSagaInstancesByCriteriaQuery query.
   *
   * @param query - The FindSagaInstancesByCriteriaQuery query to execute.
   * @returns The PaginatedResult of SagaInstanceViewModels.
   */
  async execute(
    query: FindSagaInstancesByCriteriaQuery,
  ): Promise<PaginatedResult<SagaInstanceViewModel>> {
    this.logger.log(
      `Executing find saga instances by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the saga instances by criteria
    return this.sagaInstanceReadRepository.findByCriteria(query.criteria);
  }
}
