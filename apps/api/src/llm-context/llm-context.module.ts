import { PromptModule } from '@/llm-context/prompt/prompt.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [PromptModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class LLMContextModule {}
