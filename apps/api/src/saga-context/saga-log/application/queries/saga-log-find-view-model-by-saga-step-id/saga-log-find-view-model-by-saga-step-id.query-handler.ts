import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogViewModelsBySagaStepIdQuery } from './saga-log-find-view-model-by-saga-step-id.query';

@QueryHandler(FindSagaLogViewModelsBySagaStepIdQuery)
export class FindSagaLogViewModelsBySagaStepIdQueryHandler
  implements IQueryHandler<FindSagaLogViewModelsBySagaStepIdQuery>
{
  private readonly logger = new Logger(
    FindSagaLogViewModelsBySagaStepIdQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
  ) {}

  /**
   * Executes the FindSagaLogViewModelsBySagaStepIdQuery query.
   *
   * @param query - The FindSagaLogViewModelsBySagaStepIdQuery query to execute.
   * @returns Array of SagaLogViewModels.
   */
  async execute(
    query: FindSagaLogViewModelsBySagaStepIdQuery,
  ): Promise<SagaLogViewModel[]> {
    this.logger.log(
      `Executing find saga log view models by saga step id query: ${query.sagaStepId.value}`,
    );

    // 01: Find the saga log view models by saga step id
    return this.sagaLogReadRepository.findBySagaStepId(query.sagaStepId.value);
  }
}
