import { Injectable, Logger } from '@nestjs/common';
import { LlmProvider } from '../llm-provider.interface';
import { OpenAiOptions } from './openai.interface';
import OpenAI from 'openai';

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

    try {
      const openai = new OpenAI({ apiKey });

      const messages = mergedOptions.messages ?? [
        { role: 'system', content: mergedOptions.systemPrompt },
        { role: 'user', content: prompt },
      ];

      this.logger.debug(`Messages: ${JSON.stringify(messages)}`);

      const completion = await openai.chat.completions.create({
        model: mergedOptions.model,
        messages,
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.max_tokens,
      });

      this.logger.debug(`Completion: ${JSON.stringify(completion)}`);

      return completion.choices[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error('Error calling OpenAI API', error);
      throw error;
    }
  }
}
