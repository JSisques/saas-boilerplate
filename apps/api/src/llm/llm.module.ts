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
    switch (provider) {
      case 'OPENAI':
        return new OpenAiService();
      case 'GEMINI':
        return new GeminiService();
      case 'DEEPSEEK':
        return new DeepSeekService();
      case 'GROQ':
        return new GroqService();
      case 'MIXTRAL':
        return new MixtralService();
      default:
        throw new Error('Invalid LLM provider');
    }
  },
};

@Module({
  providers: [LlmService, OpenAiService, GeminiService, DeepSeekService, GroqService, MixtralService, llmProviderFactory],
  exports: [LlmService],
})
export class LlmModule {}
