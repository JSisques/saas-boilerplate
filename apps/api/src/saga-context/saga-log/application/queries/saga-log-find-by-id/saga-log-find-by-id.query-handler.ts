import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogByIdQuery } from './saga-log-find-by-id.query';

@QueryHandler(FindSagaLogByIdQuery)
export class FindSagaLogByIdQueryHandler
  implements IQueryHandler<FindSagaLogByIdQuery>
{
  private readonly logger = new Logger(FindSagaLogByIdQueryHandler.name);

  constructor(
    private readonly assertSagaLogExistsService: AssertSagaLogExistsService,
  ) {}

  /**
   * Executes the FindSagaLogByIdQuery query.
   *
   * @param query - The FindSagaLogByIdQuery query to execute.
   * @returns The SagaLogAggregate if found.
   */
  async execute(query: FindSagaLogByIdQuery): Promise<SagaLogAggregate> {
    this.logger.log(`Executing find saga log by id query: ${query.id.value}`);

    // 01: Assert the saga log exists
    return await this.assertSagaLogExistsService.execute(query.id.value);
  }
}
