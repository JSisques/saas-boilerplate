import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class LLMContextModule {}
