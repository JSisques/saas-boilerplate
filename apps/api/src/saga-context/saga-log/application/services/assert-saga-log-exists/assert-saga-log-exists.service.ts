import { SagaLogNotFoundException } from '@/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssertSagaLogExistsService
  implements IBaseService<string, SagaLogAggregate>
{
  private readonly logger = new Logger(AssertSagaLogExistsService.name);

  constructor(
    @Inject(SAGA_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly sagaLogWriteRepository: SagaLogWriteRepository,
  ) {}

  async execute(id: string): Promise<SagaLogAggregate> {
    this.logger.log(`Asserting saga log exists by id: ${id}`);

    // 01: Find the saga log by id
    const existingSagaLog = await this.sagaLogWriteRepository.findById(id);

    // 02: If the saga log does not exist, throw an error
    if (!existingSagaLog) {
      this.logger.error(`Saga log not found by id: ${id}`);
      throw new SagaLogNotFoundException(id);
    }

    return existingSagaLog;
  }
}
