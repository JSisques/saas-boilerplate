import { PromptNotFoundException } from '@/llm-context/prompt/application/exceptions/prompt-not-found/prompt-not-found.exception';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertPromptViewModelExsistsService
  implements IBaseService<string, PromptViewModel>
{
  private readonly logger = new Logger(
    AssertPromptViewModelExsistsService.name,
  );

  constructor(
    @Inject(PROMPT_READ_REPOSITORY_TOKEN)
    private readonly promptReadRepository: PromptReadRepository,
  ) {}

  /**
   * Asserts that a prompt view model exists by id.
   *
   * @param id - The id of the prompt view model to assert.
   * @returns The prompt view model.
   * @throws PromptNotFoundException if the prompt view model does not exist.
   */
  async execute(id: string): Promise<PromptViewModel> {
    this.logger.log(`Asserting prompt view model exists by id: ${id}`);

    // 01: Find the prompt by id
    const existingPromptViewModel =
      await this.promptReadRepository.findById(id);

    // 02: If the subscription view model does not exist, throw an error
    if (!existingPromptViewModel) {
      this.logger.error(`Prompt view model not found by id: ${id}`);
      throw new PromptNotFoundException(id);
    }

    return existingPromptViewModel;
  }
}
