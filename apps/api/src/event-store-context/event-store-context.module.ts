import { EventModule } from '@/event-store-context/event/event.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [EventModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class EventContextModule {}
