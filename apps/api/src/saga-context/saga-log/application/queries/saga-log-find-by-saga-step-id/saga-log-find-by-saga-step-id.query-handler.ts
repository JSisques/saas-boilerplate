import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogsBySagaStepIdQuery } from './saga-log-find-by-saga-step-id.query';

@QueryHandler(FindSagaLogsBySagaStepIdQuery)
export class FindSagaLogsBySagaStepIdQueryHandler
  implements IQueryHandler<FindSagaLogsBySagaStepIdQuery>
{
  private readonly logger = new Logger(
    FindSagaLogsBySagaStepIdQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
  ) {}

  /**
   * Executes the FindSagaLogsBySagaStepIdQuery query.
   *
   * @param query - The FindSagaLogsBySagaStepIdQuery query to execute.
   * @returns Array of SagaLogAggregates.
   */
  async execute(
    query: FindSagaLogsBySagaStepIdQuery,
  ): Promise<SagaLogAggregate[]> {
    this.logger.log(
      `Executing find saga logs by saga step id query: ${query.sagaStepId.value}`,
    );

    // 01: Find the saga logs by saga step id
    return this.sagaLogWriteRepository.findBySagaStepId(query.sagaStepId.value);
  }
}
