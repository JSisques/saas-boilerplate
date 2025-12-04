import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogViewModelsBySagaInstanceIdQuery } from './saga-log-find-view-model-by-saga-instance-id.query';

@QueryHandler(FindSagaLogViewModelsBySagaInstanceIdQuery)
export class FindSagaLogViewModelsBySagaInstanceIdQueryHandler
  implements IQueryHandler<FindSagaLogViewModelsBySagaInstanceIdQuery>
{
  private readonly logger = new Logger(
    FindSagaLogViewModelsBySagaInstanceIdQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
  ) {}

  /**
   * Executes the FindSagaLogViewModelsBySagaInstanceIdQuery query.
   *
   * @param query - The FindSagaLogViewModelsBySagaInstanceIdQuery query to execute.
   * @returns Array of SagaLogViewModels.
   */
  async execute(
    query: FindSagaLogViewModelsBySagaInstanceIdQuery,
  ): Promise<SagaLogViewModel[]> {
    this.logger.log(
      `Executing find saga log view models by saga instance id query: ${query.sagaInstanceId.value}`,
    );

    // 01: Find the saga log view models by saga instance id
    return this.sagaLogReadRepository.findBySagaInstanceId(
      query.sagaInstanceId.value,
    );
  }
}
