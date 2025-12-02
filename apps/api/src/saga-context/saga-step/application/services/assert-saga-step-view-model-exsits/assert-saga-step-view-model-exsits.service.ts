import { SagaStepNotFoundException } from '@/saga-context/saga-step/application/exceptions/saga-step-not-found/saga-step-not-found.exception';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaStepViewModelExsistsService
  implements IBaseService<string, SagaStepViewModel>
{
  private readonly logger = new Logger(
    AssertSagaStepViewModelExsistsService.name,
  );

  constructor(
    @Inject(SAGA_STEP_READ_REPOSITORY_TOKEN)
    private readonly sagaStepReadRepository: SagaStepReadRepository,
  ) {}

  /**
   * Asserts that a saga step view model exists by id.
   *
   * @param id - The id of the saga step view model to assert.
   * @returns The saga step view model.
   * @throws SagaStepNotFoundException if the saga step view model does not exist.
   */
  async execute(id: string): Promise<SagaStepViewModel> {
    this.logger.log(`Asserting saga step view model exists by id: ${id}`);

    // 01: Find the saga step by id
    const existingSagaStepViewModel =
      await this.sagaStepReadRepository.findById(id);

    // 02: If the saga step view model does not exist, throw an error
    if (!existingSagaStepViewModel) {
      this.logger.error(`Saga step view model not found by id: ${id}`);
      throw new SagaStepNotFoundException(id);
    }

    return existingSagaStepViewModel;
  }
}
