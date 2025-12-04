import { AssertSagaInstanceExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaInstanceByIdQuery } from './saga-instance-find-by-id.query';

@QueryHandler(FindSagaInstanceByIdQuery)
export class FindSagaInstanceByIdQueryHandler
  implements IQueryHandler<FindSagaInstanceByIdQuery>
{
  private readonly logger = new Logger(FindSagaInstanceByIdQueryHandler.name);

  constructor(
    private readonly assertSagaInstanceExistsService: AssertSagaInstanceExistsService,
  ) {}

  /**
   * Executes the FindSagaInstanceByIdQuery query.
   *
   * @param query - The FindSagaInstanceByIdQuery query to execute.
   * @returns The SagaInstanceAggregate if found, null otherwise.
   */
  async execute(
    query: FindSagaInstanceByIdQuery,
  ): Promise<SagaInstanceAggregate> {
    this.logger.log(
      `Executing find saga instance by id query: ${query.id.value}`,
    );

    // 01: Assert the saga instance exists
    return await this.assertSagaInstanceExistsService.execute(query.id.value);
  }
}
