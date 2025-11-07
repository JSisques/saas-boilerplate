import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPromptViewModelByIdQuery } from './prompt-find-view-model-by-id.query';

@QueryHandler(FindPromptViewModelByIdQuery)
export class FindPromptViewModelByIdQueryHandler
  implements IQueryHandler<FindPromptViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindPromptViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertPromptViewModelExsistsService: AssertPromptViewModelExsistsService,
  ) {}

  /**
   * Executes the FindPromptViewModelByIdQuery query.
   *
   * @param query - The FindPromptViewModelByIdQuery query to execute.
   * @returns The PromptViewModel if found, null otherwise.
   */
  async execute(query: FindPromptViewModelByIdQuery): Promise<PromptViewModel> {
    this.logger.log(
      `Executing find prompt view model by id query: ${query.id.value}`,
    );

    // 01: Assert that the prompt view model exists
    return await this.assertPromptViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
