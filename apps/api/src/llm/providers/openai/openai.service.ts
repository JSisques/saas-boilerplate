import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { OpenAiOptions } from './openai.interface';

@Injectable()
export class OpenAiService implements LlmProvider {
  private readonly logger = new Logger(OpenAiService.name);

  private readonly defaultOptions: OpenAiOptions = {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4',
    temperature: process.env.OPENAI_DEFAULT_TEMPERATURE ? Number(process.env.OPENAI_DEFAULT_TEMPERATURE) : 0.7,
  };

  async generateText(prompt: string, options?: OpenAiOptions): Promise<string> {
    this.logger.log(`Generating text with OpenAI provider`);

    const mergedOptions = { ...this.defaultOptions, ...options };
    const apiKey = mergedOptions.apiKey;

    if (!apiKey) {
      this.logger.error('OpenAI API key not set');
      throw new Error('OpenAI API key not set');
    }

    // Aquí iría la llamada real a la API de OpenAI usando mergedOptions
    return `OpenAI response for prompt: ${prompt} (model: ${mergedOptions.model})`;
  }
}
