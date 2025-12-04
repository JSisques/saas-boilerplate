import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepWriteRepository } from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepPrismaMapper } from '@/saga-context/saga-step/infrastructure/database/prisma/mappers/saga-step-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepPrismaRepository
  extends BasePrismaMasterRepository
  implements SagaStepWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly sagaStepPrismaMapper: SagaStepPrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(SagaStepPrismaRepository.name);
  }

  /**
   * Finds a saga step by their id
   *
   * @param id - The id of the saga step to find
   * @returns The saga step if found, null otherwise
   */
  async findById(id: string): Promise<SagaStepAggregate | null> {
    const sagaStepData =
      await this.prismaMasterService.client.sagaStep.findUnique({
        where: { id },
      });

    if (!sagaStepData) {
      return null;
    }

    return this.sagaStepPrismaMapper.toDomainEntity(sagaStepData);
  }

  /**
   * Finds saga steps by their saga instance id
   *
   * @param sagaInstanceId - The saga instance id of the saga steps to find
   * @returns The saga steps if found, empty array otherwise
   */
  async findBySagaInstanceId(
    sagaInstanceId: string,
  ): Promise<SagaStepAggregate[]> {
    const sagaStepsData =
      await this.prismaMasterService.client.sagaStep.findMany({
        where: { sagaInstanceId },
      });

    return sagaStepsData.map((sagaStepData) =>
      this.sagaStepPrismaMapper.toDomainEntity(sagaStepData),
    );
  }

  /**
   * Saves a saga step
   *
   * @param sagaStep - The saga step to save
   * @returns The saved saga step
   */
  async save(sagaStep: SagaStepAggregate): Promise<SagaStepAggregate> {
    const sagaStepData = this.sagaStepPrismaMapper.toPrismaData(sagaStep);

    const result = await this.prismaMasterService.client.sagaStep.upsert({
      where: { id: sagaStep.id.value },
      update: sagaStepData,
      create: sagaStepData,
    });

    return this.sagaStepPrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a saga step
   *
   * @param id - The id of the saga step to delete
   * @returns True if the saga step was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting saga step by id: ${id}`);

    await this.prismaMasterService.client.sagaStep.delete({
      where: { id },
    });

    return true;
  }
}
