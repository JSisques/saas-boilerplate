import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaLogViewModelByIdQuery } from './saga-log-find-view-model-by-id.query';

@QueryHandler(FindSagaLogViewModelByIdQuery)
export class FindSagaLogViewModelByIdQueryHandler
  implements IQueryHandler<FindSagaLogViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindSagaLogViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertSagaLogViewModelExistsService: AssertSagaLogViewModelExistsService,
  ) {}

  /**
   * Executes the FindSagaLogViewModelByIdQuery query.
   *
   * @param query - The FindSagaLogViewModelByIdQuery query to execute.
   * @returns The SagaLogViewModel if found.
   */
  async execute(
    query: FindSagaLogViewModelByIdQuery,
  ): Promise<SagaLogViewModel> {
    this.logger.log(
      `Executing find saga log view model by id query: ${query.id.value}`,
    );

    // 01: Assert the saga log view model exists
    return await this.assertSagaLogViewModelExistsService.execute(
      query.id.value,
    );
  }
}
