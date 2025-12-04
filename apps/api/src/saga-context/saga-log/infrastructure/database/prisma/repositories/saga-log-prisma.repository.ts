import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogWriteRepository } from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogPrismaMapper } from '@/saga-context/saga-log/infrastructure/database/prisma/mappers/saga-log-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogPrismaRepository
  extends BasePrismaMasterRepository
  implements SagaLogWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly sagaLogPrismaMapper: SagaLogPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(SagaLogPrismaRepository.name);
  }

  /**
   * Finds a saga log by their id
   *
   * @param id - The id of the saga log to find
   * @returns The saga log if found, null otherwise
   */
  async findById(id: string): Promise<SagaLogAggregate | null> {
    const sagaLogData =
      await this.prismaMasterService.client.sagaLog.findUnique({
        where: { id },
      });

    if (!sagaLogData) {
      return null;
    }

    return this.sagaLogPrismaMapper.toDomainEntity(sagaLogData);
  }

  /**
   * Finds saga logs by their saga instance id
   *
   * @param sagaInstanceId - The saga instance id of the saga logs to find
   * @returns The saga logs if found, empty array otherwise
   */
  async findBySagaInstanceId(
    sagaInstanceId: string,
  ): Promise<SagaLogAggregate[]> {
    const sagaLogsData = await this.prismaMasterService.client.sagaLog.findMany(
      {
        where: { sagaInstanceId },
      },
    );

    return sagaLogsData.map((sagaLogData) =>
      this.sagaLogPrismaMapper.toDomainEntity(sagaLogData),
    );
  }

  /**
   * Finds saga logs by their saga step id
   *
   * @param sagaStepId - The saga step id of the saga logs to find
   * @returns The saga logs if found, empty array otherwise
   */
  async findBySagaStepId(sagaStepId: string): Promise<SagaLogAggregate[]> {
    const sagaLogsData = await this.prismaMasterService.client.sagaLog.findMany(
      {
        where: { sagaStepId },
      },
    );

    return sagaLogsData.map((sagaLogData) =>
      this.sagaLogPrismaMapper.toDomainEntity(sagaLogData),
    );
  }

  /**
   * Saves a saga log
   *
   * @param sagaLog - The saga log to save
   * @returns The saved saga log
   */
  async save(sagaLog: SagaLogAggregate): Promise<SagaLogAggregate> {
    const sagaLogData = this.sagaLogPrismaMapper.toPrismaData(sagaLog);

    const result = await this.prismaMasterService.client.sagaLog.upsert({
      where: { id: sagaLog.id.value },
      update: sagaLogData,
      create: sagaLogData,
    });

    return this.sagaLogPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a saga log
   *
   * @param id - The id of the saga log to delete
   * @returns True if the saga log was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting saga log by id: ${id}`);

    await this.prismaMasterService.client.sagaLog.delete({
      where: { id },
    });

    return true;
  }
}
