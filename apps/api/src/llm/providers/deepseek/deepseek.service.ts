import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { DeepSeekOptions } from './deepseek.interface';
import OpenAI from 'openai';

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

    try {
      const deepseek = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: apiKey,
      });

      const messages = mergedOptions.messages ?? [
        { role: 'system', content: mergedOptions.systemPrompt },
        { role: 'user', content: prompt },
      ];

      this.logger.debug(`Messages: ${JSON.stringify(messages)}`);

      const completion = await deepseek.chat.completions.create({
        model: mergedOptions.model,
        messages,
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.max_tokens,
      });

      this.logger.debug(`Completion: ${JSON.stringify(completion)}`);

      return completion.choices[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error('Error calling DeepSeek API', error);
      throw error;
    }
  }
}
