import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { GroqOptions } from './groq.interface';

@Injectable()
export class GroqService implements LlmProvider {
  private readonly logger = new Logger(GroqService.name);

  private readonly defaultOptions: GroqOptions = {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_DEFAULT_MODEL || 'llama3-70b-8192',
    temperature: process.env.GROQ_DEFAULT_TEMPERATURE ? Number(process.env.GROQ_DEFAULT_TEMPERATURE) : 0.7,
  };

  async generateText(prompt: string, options?: GroqOptions): Promise<string> {
    this.logger.log(`Generating text with Groq provider`);

    const mergedOptions = { ...this.defaultOptions, ...options };
    const apiKey = mergedOptions.apiKey;

    if (!apiKey) {
      this.logger.error('Groq API key not set');
      throw new Error('Groq API key not set');
    }

    // Aquí iría la llamada real a la API de Groq usando mergedOptions
    return `Groq response for prompt: ${prompt} (model: ${mergedOptions.model})`;
  }
}
