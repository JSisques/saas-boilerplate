import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { MixtralOptions } from './mixtral.interface';

@Injectable()
export class MixtralService implements LlmProvider {
  private readonly logger = new Logger(MixtralService.name);

  private readonly defaultOptions: MixtralOptions = {
    apiKey: process.env.MIXTRAL_API_KEY || '',
    model: process.env.MIXTRAL_DEFAULT_MODEL || 'mixtral-8x7b-32768',
    temperature: process.env.MIXTRAL_DEFAULT_TEMPERATURE ? Number(process.env.MIXTRAL_DEFAULT_TEMPERATURE) : 0.7,
  };

  async generateText(prompt: string, options?: MixtralOptions): Promise<string> {
    this.logger.log(`Generating text with Mixtral provider`);

    const mergedOptions = { ...this.defaultOptions, ...options };
    const apiKey = mergedOptions.apiKey;

    if (!apiKey) {
      this.logger.error('Mixtral API key not set');
      throw new Error('Mixtral API key not set');
    }

    // Aquí iría la llamada real a la API de Mixtral usando mergedOptions
    return `Mixtral response for prompt: ${prompt} (model: ${mergedOptions.model})`;
  }
}
