import { SagaInstanceModule } from '@/saga-context/saga-instance/saga-instance.module';
import { SagaStepModule } from '@/saga-context/saga-step/saga-step.module';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const MODULES = [SagaInstanceModule, SagaStepModule];

@Module({
  imports: [SharedModule, ...MODULES],
  controllers: [],
  providers: [],
  exports: [...MODULES],
})
export class SagaContextModule {}
