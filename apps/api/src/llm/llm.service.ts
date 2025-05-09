import { Inject, Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from './providers/llm-provider.interface';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(@Inject('LLM_PROVIDER') private readonly llmProvider: LlmProvider) {}

  /**
   * Generates text using the configured LLM provider
   * @param prompt The input text prompt to generate from
   * @param options Provider-specific configuration options
   * @returns A Promise that resolves to the generated text string
   */
  async generateText(prompt: string, options?: any): Promise<string> {
    this.logger.log(`Generating text with provider: ${this.llmProvider.constructor.name}`);
    return this.llmProvider.generateText(prompt, options);
  }
}
