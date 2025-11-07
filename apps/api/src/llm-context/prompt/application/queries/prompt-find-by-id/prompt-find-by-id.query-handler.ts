import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPromptByIdQuery } from './prompt-find-by-id.query';

@QueryHandler(FindPromptByIdQuery)
export class FindPromptByIdQueryHandler
  implements IQueryHandler<FindPromptByIdQuery>
{
  private readonly logger = new Logger(FindPromptByIdQueryHandler.name);

  constructor(
    private readonly assertPromptExsistsService: AssertPromptExsistsService,
  ) {}

  /**
   * Executes the FindPromptByIdQuery query.
   *
   * @param query - The FindPromptByIdQuery query to execute.
   * @returns The PromptAggregate if found, null otherwise.
   */
  async execute(query: FindPromptByIdQuery): Promise<PromptAggregate> {
    this.logger.log(`Executing find prompt by id query: ${query.id.value}`);

    // 01: Assert that the prompt exists
    return await this.assertPromptExsistsService.execute(query.id.value);
  }
}
