import { SagaStepAlreadyExistsException } from '@/saga-context/saga-step/application/exceptions/saga-step-already-exists/saga-step-already-exists.exception';
import {
  SAGA_STEP_WRITE_REPOSITORY_TOKEN,
  SagaStepWriteRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaStepNotExistsService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(AssertSagaStepNotExistsService.name);

  constructor(
    @Inject(SAGA_STEP_WRITE_REPOSITORY_TOKEN)
    private readonly sagaStepWriteRepository: SagaStepWriteRepository,
  ) {}

  /**
   * Asserts that a saga step does not exist by id.
   *
   * @param id - The id of the saga step to assert.
   * @returns void
   * @throws SagaStepAlreadyExistsException if the saga step exists.
   */
  async execute(id: string): Promise<void> {
    this.logger.log(`Asserting saga step not exists by id: ${id}`);

    // 01: Find the saga step by id
    const existingSagaStep = await this.sagaStepWriteRepository.findById(id);

    // 02: If the saga step exists, throw an error
    if (existingSagaStep) {
      this.logger.error(`Saga step with id ${id} already exists`);
      throw new SagaStepAlreadyExistsException(id);
    }
  }
}
