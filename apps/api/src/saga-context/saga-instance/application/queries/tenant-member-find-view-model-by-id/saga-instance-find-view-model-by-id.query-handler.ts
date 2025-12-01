import { FindSagaInstanceViewModelByIdQuery } from '@/saga-context/saga-instance/application/queries/tenant-member-find-view-model-by-id/saga-instance-find-view-model-by-id.query';
import { AssertSagaInstanceViewModelExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exsits/assert-saga-instance-view-model-exsits.service';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindSagaInstanceViewModelByIdQuery)
export class FindSagaInstanceViewModelByIdQueryHandler
  implements IQueryHandler<FindSagaInstanceViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindSagaInstanceViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertSagaInstanceViewModelExsistsService: AssertSagaInstanceViewModelExsistsService,
  ) {}

  /**
   * Executes the FindSagaInstanceViewModelByIdQuery query.
   *
   * @param query - The FindSagaInstanceViewModelByIdQuery query to execute.
   * @returns The SagaInstanceViewModel if found, null otherwise.
   */
  async execute(
    query: FindSagaInstanceViewModelByIdQuery,
  ): Promise<SagaInstanceViewModel> {
    this.logger.log(
      `Executing find saga instance view model by id query: ${query.id.value}`,
    );

    // 01: Assert the saga instance view model exists
    return await this.assertSagaInstanceViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
