import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { GeminiOptions } from './gemini.interface';

@Injectable()
export class GeminiService implements LlmProvider {
  private readonly logger = new Logger(GeminiService.name);

  private readonly defaultOptions: GeminiOptions = {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_DEFAULT_MODEL || 'gemini-pro',
    temperature: process.env.GEMINI_DEFAULT_TEMPERATURE ? Number(process.env.GEMINI_DEFAULT_TEMPERATURE) : 0.7,
  };

  async generateText(prompt: string, options?: GeminiOptions): Promise<string> {
    this.logger.log(`Generating text with Gemini provider`);

    const mergedOptions = { ...this.defaultOptions, ...options };
    const apiKey = mergedOptions.apiKey;

    if (!apiKey) {
      this.logger.error('Gemini API key not set');
      throw new Error('Gemini API key not set');
    }

    // Aquí iría la llamada real a la API de Gemini usando mergedOptions
    return `Gemini response for prompt: ${prompt} (model: ${mergedOptions.model})`;
  }
}
