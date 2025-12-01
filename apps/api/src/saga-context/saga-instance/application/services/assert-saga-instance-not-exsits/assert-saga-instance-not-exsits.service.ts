import { SagaInstanceAlreadyExistsException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-already-exists/saga-instance-already-exists.exception';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaInstanceNotExsistsService
  implements IBaseService<string, void>
{
  private readonly logger = new Logger(
    AssertSagaInstanceNotExsistsService.name,
  );

  constructor(
    @Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
    private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
  ) {}

  /**
   * Asserts that a saga instance does not exist by id.
   *
   * @param id - The id of the saga instance to assert.
   * @returns void
   * @throws SagaInstanceAlreadyExistsException if the saga instance exists.
   */
  async execute(id: string): Promise<void> {
    this.logger.log(`Asserting saga instance not exists by id: ${id}`);

    // 01: Find the saga instance by id
    const existingSagaInstance =
      await this.sagaInstanceWriteRepository.findById(id);

    // 02: If the saga instance exists, throw an error
    if (existingSagaInstance) {
      this.logger.error(`Saga instance with id ${id} already exists`);
      throw new SagaInstanceAlreadyExistsException(id);
    }
  }
}
