import { SagaLogNotFoundException } from '@/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaLogViewModelExistsService
  implements IBaseService<string, SagaLogViewModel>
{
  private readonly logger = new Logger(
    AssertSagaLogViewModelExistsService.name,
  );

  constructor(
    @Inject(SAGA_LOG_READ_REPOSITORY_TOKEN)
    private readonly sagaLogReadRepository: SagaLogReadRepository,
  ) {}

  /**
   * Asserts that a saga log view model exists by id.
   *
   * @param id - The id of the saga log view model to assert.
   * @returns The saga log view model.
   * @throws SagaLogNotFoundException if the saga log view model does not exist.
   */
  async execute(id: string): Promise<SagaLogViewModel> {
    this.logger.log(`Asserting saga log view model exists by id: ${id}`);

    // 01: Find the saga log by id
    const existingSagaLogViewModel =
      await this.sagaLogReadRepository.findById(id);

    // 02: If the saga log view model does not exist, throw an error
    if (!existingSagaLogViewModel) {
      this.logger.error(`Saga log view model not found by id: ${id}`);
      throw new SagaLogNotFoundException(id);
    }

    return existingSagaLogViewModel;
  }
}
