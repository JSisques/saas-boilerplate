import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPromptsByCriteriaQuery } from './prompt-find-by-criteria.query';

@QueryHandler(FindPromptsByCriteriaQuery)
export class FindPromptsByCriteriaQueryHandler
  implements IQueryHandler<FindPromptsByCriteriaQuery>
{
  private readonly logger = new Logger(FindPromptsByCriteriaQueryHandler.name);

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
  ) {}

  /**
   * Executes the FindPromptsByCriteriaQuery query.
   *
   * @param query - The FindPromptsByCriteriaQuery query to execute.
   * @returns The PaginatedResult of PromptViewModels.
   */
  async execute(
    query: FindPromptsByCriteriaQuery,
  ): Promise<PaginatedResult<PromptViewModel>> {
    this.logger.log(
      `Executing find prompts by criteria query: ${query.criteria.toString()}`,
    );

    // 01: Find the prompts by criteria
    return this.promptReadRepository.findByCriteria(query.criteria);
  }
}
