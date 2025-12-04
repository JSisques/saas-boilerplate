import { SagaLogAlreadyExistsException } from '@/saga-context/saga-log/application/exceptions/saga-log-already-exists/saga-log-already-exists.exception';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaLogNotExistsService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(AssertSagaLogNotExistsService.name);

  constructor(
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
  ) {}

  /**
   * Asserts that a saga log does not exist by id.
   *
   * @param id - The id of the saga log to assert.
   * @returns void
   * @throws SagaLogAlreadyExistsException if the saga log exists.
   */
  async execute(id: string): Promise<void> {
    this.logger.log(`Asserting saga log not exists by id: ${id}`);

    // 01: Find the saga log by id
    const existingSagaLog = await this.sagaLogWriteRepository.findById(id);

    // 02: If the saga log exists, throw an error
    if (existingSagaLog) {
      this.logger.error(`Saga log with id ${id} already exists`);
      throw new SagaLogAlreadyExistsException(id);
    }
  }
}
