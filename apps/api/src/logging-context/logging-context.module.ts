import { LoggingModule } from '@/logging-context/logging/logging.module';
import { Module } from '@nestjs/common';

const MODULES = [LoggingModule];

@Module({
  imports: [...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class LoggingContextModule {}
