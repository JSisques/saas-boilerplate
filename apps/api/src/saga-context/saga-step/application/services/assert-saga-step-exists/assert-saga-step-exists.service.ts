import { SagaStepNotFoundException } from '@/saga-context/saga-step/application/exceptions/saga-step-not-found/saga-step-not-found.exception';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaStepExistsService
  implements IBaseService<string, SagaStepAggregate>
{
  private readonly logger = new Logger(AssertSagaStepExistsService.name);

  constructor(
    @Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
    private readonly sagaStepWriteRepository: SagaStepWriteRepository,
  ) {}

  async execute(id: string): Promise<SagaStepAggregate> {
    this.logger.log(`Asserting saga step exists by id: ${id}`);

    // 01: Find the saga step by id
    const existingSagaStep = await this.sagaStepWriteRepository.findById(id);

    // 02: If the saga step does not exist, throw an error
    if (!existingSagaStep) {
      this.logger.error(`Saga step not found by id: ${id}`);
      throw new SagaStepNotFoundException(id);
    }

    return existingSagaStep;
  }
}
