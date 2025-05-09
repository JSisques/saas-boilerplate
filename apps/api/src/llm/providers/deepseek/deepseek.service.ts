import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { DeepSeekOptions } from './deepseek.interface';

@Injectable()
export class DeepSeekService implements LlmProvider {
  private readonly logger = new Logger(DeepSeekService.name);

  private readonly defaultOptions: DeepSeekOptions = {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: process.env.DEEPSEEK_DEFAULT_MODEL || 'deepseek-chat',
    temperature: process.env.DEEPSEEK_DEFAULT_TEMPERATURE ? Number(process.env.DEEPSEEK_DEFAULT_TEMPERATURE) : 0.7,
  };

  async generateText(prompt: string, options?: DeepSeekOptions): Promise<string> {
    this.logger.log(`Generating text with DeepSeek provider`);

    const mergedOptions = { ...this.defaultOptions, ...options };
    const apiKey = mergedOptions.apiKey;

    if (!apiKey) {
      this.logger.error('DeepSeek API key not set');
      throw new Error('DeepSeek API key not set');
    }

    // Aquí iría la llamada real a la API de DeepSeek usando mergedOptions
    return `DeepSeek response for prompt: ${prompt} (model: ${mergedOptions.model})`;
  }
}
