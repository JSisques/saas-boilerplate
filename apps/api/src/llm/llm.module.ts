import { Module, Provider } from '@nestjs/common';
import { LlmService } from './llm.service';
import { OpenAiService } from './providers/openai/openai.service';
import { GeminiService } from './providers/gemini/gemini.service';
import { DeepSeekService } from './providers/deepseek/deepseek.service';
import { GroqService } from './providers/groq/groq.service';
import { MixtralService } from './providers/mixtral/mixtral.service';

const llmProviderFactory: Provider = {
  provide: 'LLM_PROVIDER',
  useFactory: () => {
    const provider = process.env.LLM_PROVIDER;
    if (provider === 'OPENAI') {
      return new OpenAiService();
    } else if (provider === 'GEMINI') {
      return new GeminiService();
    } else if (provider === 'DEEPSEEK') {
      return new DeepSeekService();
    } else if (provider === 'GROQ') {
      return new GroqService();
    } else if (provider === 'MIXTRAL') {
      return new MixtralService();
    }
    throw new Error('Invalid LLM provider');
  },
};

@Module({
  providers: [LlmService, OpenAiService, GeminiService, DeepSeekService, GroqService, MixtralService, llmProviderFactory],
  exports: [LlmService],
})
export class LlmModule {}
