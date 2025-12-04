import { AssertSagaStepViewModelExistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exists/assert-saga-step-view-model-exists.service';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindSagaStepViewModelByIdQuery } from './saga-step-find-view-model-by-id.query';

@QueryHandler(FindSagaStepViewModelByIdQuery)
export class FindSagaStepViewModelByIdQueryHandler
  implements IQueryHandler<FindSagaStepViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindSagaStepViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertSagaStepViewModelExistsService: AssertSagaStepViewModelExistsService,
  ) {}

  /**
   * Executes the FindSagaStepViewModelByIdQuery query.
   *
   * @param query - The FindSagaStepViewModelByIdQuery query to execute.
   * @returns The SagaStepViewModel if found.
   */
  async execute(
    query: FindSagaStepViewModelByIdQuery,
  ): Promise<SagaStepViewModel> {
    this.logger.log(
      `Executing find saga step view model by id query: ${query.id.value}`,
    );

    // 01: Assert the saga step view model exists
    return await this.assertSagaStepViewModelExistsService.execute(
      query.id.value,
    );
  }
}
