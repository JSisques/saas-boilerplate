import { SagaInstanceNotFoundException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-not-found/saga-instance-not-found.exception';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaInstanceViewModelExsistsService
  implements IBaseService<string, SagaInstanceViewModel>
{
  private readonly logger = new Logger(
    AssertSagaInstanceViewModelExsistsService.name,
  );

  constructor(
    @Inject(SAGA_INSTANCE_READ_REPOSITORY_TOKEN)
    private readonly sagaInstanceReadRepository: SagaInstanceReadRepository,
  ) {}

  /**
   * Asserts that a saga instance view model exists by id.
   *
   * @param id - The id of the saga instance view model to assert.
   * @returns The saga instance view model.
   * @throws SagaInstanceNotFoundException if the saga instance view model does not exist.
   */
  async execute(id: string): Promise<SagaInstanceViewModel> {
    this.logger.log(`Asserting saga instance view model exists by id: ${id}`);

    // 01: Find the saga instance by id
    const existingSagaInstanceViewModel =
      await this.sagaInstanceReadRepository.findById(id);

    // 02: If the saga instance view model does not exist, throw an error
    if (!existingSagaInstanceViewModel) {
      this.logger.error(`Saga instance view model not found by id: ${id}`);
      throw new SagaInstanceNotFoundException(id);
    }

    return existingSagaInstanceViewModel;
  }
}
