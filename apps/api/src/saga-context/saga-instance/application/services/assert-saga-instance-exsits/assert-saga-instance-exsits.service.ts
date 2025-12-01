import { SagaInstanceNotFoundException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-not-found/saga-instance-not-found.exception';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaInstanceExsistsService
  implements IBaseService<string, SagaInstanceAggregate>
{
  private readonly logger = new Logger(AssertSagaInstanceExsistsService.name);

  constructor(
    @Inject(SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN)
    private readonly sagaInstanceWriteRepository: SagaInstanceWriteRepository,
  ) {}

  async execute(id: string): Promise<SagaInstanceAggregate> {
    this.logger.log(`Asserting saga instance exists by id: ${id}`);

    // 01: Find the saga instance by id
    const existingSagaInstance =
      await this.sagaInstanceWriteRepository.findById(id);

    // 02: If the saga instance does not exist, throw an error
    if (!existingSagaInstance) {
      this.logger.error(`Saga instance not found by id: ${id}`);
      throw new SagaInstanceNotFoundException(id);
    }

    return existingSagaInstance;
  }
}
