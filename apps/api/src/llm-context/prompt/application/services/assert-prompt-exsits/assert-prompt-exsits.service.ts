import { PromptNotFoundException } from '@/llm-context/prompt/application/exceptions/prompt-not-found/prompt-not-found.exception';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertPromptExsistsService
  implements IBaseService<string, PromptAggregate>
{
  private readonly logger = new Logger(AssertPromptExsistsService.name);

  constructor(
    @Inject(PROMPT_WRITE_REPOSITORY_TOKEN)
    private readonly promptWriteRepository: PromptWriteRepository,
  ) {}

  /**
   * Asserts that a prompt exists by id.
   *
   * @param id - The id of the prompt to assert.
   * @returns The prompt aggregate.
   */
  async execute(id: string): Promise<PromptAggregate> {
    this.logger.log(`Asserting prompt exists by id: ${id}`);

    // 01: Find the prompt by id
    const existingPrompt = await this.promptWriteRepository.findById(id);

    // 02: If the prompt does not exist, throw an error
    if (!existingPrompt) {
      this.logger.error(`Prompt not found by id: ${id}`);
      throw new PromptNotFoundException(id);
    }

    return existingPrompt;
  }
}
