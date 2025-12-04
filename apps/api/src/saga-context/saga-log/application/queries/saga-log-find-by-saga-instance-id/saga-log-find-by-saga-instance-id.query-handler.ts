import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogsBySagaInstanceIdQuery } from './saga-log-find-by-saga-instance-id.query';

@QueryHandler(FindSagaLogsBySagaInstanceIdQuery)
export class FindSagaLogsBySagaInstanceIdQueryHandler
  implements IQueryHandler<FindSagaLogsBySagaInstanceIdQuery>
{
  private readonly logger = new Logger(
    FindSagaLogsBySagaInstanceIdQueryHandler.name,
  );

  constructor(
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
  ) {}

  /**
   * Executes the FindSagaLogsBySagaInstanceIdQuery query.
   *
   * @param query - The FindSagaLogsBySagaInstanceIdQuery query to execute.
   * @returns Array of SagaLogAggregates.
   */
  async execute(
    query: FindSagaLogsBySagaInstanceIdQuery,
  ): Promise<SagaLogAggregate[]> {
    this.logger.log(
      `Executing find saga logs by saga instance id query: ${query.sagaInstanceId.value}`,
    );

    // 01: Find the saga logs by saga instance id
    return this.sagaLogWriteRepository.findBySagaInstanceId(
      query.sagaInstanceId.value,
    );
  }
}
