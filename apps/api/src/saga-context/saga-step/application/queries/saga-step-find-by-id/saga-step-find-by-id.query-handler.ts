import { AssertSagaStepExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaStepByIdQuery } from './saga-step-find-by-id.query';

@QueryHandler(FindSagaStepByIdQuery)
export class FindSagaStepByIdQueryHandler
  implements IQueryHandler<FindSagaStepByIdQuery>
{
  private readonly logger = new Logger(FindSagaStepByIdQueryHandler.name);

  constructor(
    private readonly assertSagaStepExistsService: AssertSagaStepExistsService,
  ) {}

  /**
   * Executes the FindSagaStepByIdQuery query.
   *
   * @param query - The FindSagaStepByIdQuery query to execute.
   * @returns The SagaStepAggregate if found.
   */
  async execute(query: FindSagaStepByIdQuery): Promise<SagaStepAggregate> {
    this.logger.log(`Executing find saga step by id query: ${query.id.value}`);

    // 01: Assert the saga step exists
    return await this.assertSagaStepExistsService.execute(query.id.value);
  }
}
