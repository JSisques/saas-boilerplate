import { SagaInstanceModule } from '@/saga-context/saga-instance/saga-instance.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [SagaInstanceModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class SagaContextModule {}
