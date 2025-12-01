import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceWriteRepository } from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstancePrismaMapper } from '@/saga-context/saga-instance/infrastructure/database/prisma/mappers/saga-instance-prisma.mapper';
import { BasePrismaMasterRepository } from '@/shared/infrastructure/database/prisma/base-prisma/base-prisma-master/base-prisma-master.repository';
import { PrismaMasterService } from '@/shared/infrastructure/database/prisma/services/prisma-master/prisma-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstancePrismaRepository
  extends BasePrismaMasterRepository
  implements SagaInstanceWriteRepository
{
  constructor(
    prismaMasterService: PrismaMasterService,
    private readonly sagaInstancePrismaMapper: SagaInstancePrismaMapper,
  ) {
    super(prismaMasterService);
    this.logger = new Logger(SagaInstancePrismaRepository.name);
  }

  /**
   * Finds a saga instance by their id
   *
   * @param id - The id of the saga instance to find
   * @returns The saga instance if found, null otherwise
   */
  async findById(id: string): Promise<SagaInstanceAggregate | null> {
    const sagaInstanceData =
      await this.prismaMasterService.client.sagaInstance.findUnique({
        where: { id },
      });

    if (!sagaInstanceData) {
      return null;
    }

    return this.sagaInstancePrismaMapper.toDomainEntity(sagaInstanceData);
  }

  /**
   * Finds a saga instance by their name
   *
   * @param name - The name of the saga instance to find
   * @returns The saga instance if found, null otherwise
   */
  async findByName(name: string): Promise<SagaInstanceAggregate | null> {
    const sagaInstanceData =
      await this.prismaMasterService.client.sagaInstance.findUnique({
        where: { name },
      });

    if (!sagaInstanceData) {
      return null;
    }

    return this.sagaInstancePrismaMapper.toDomainEntity(sagaInstanceData);
  }

  /**
   * Saves a saga instance
   *
   * @param sagaInstance - The saga instance to save
   * @returns The saved saga instance
   */
  async save(
    sagaInstance: SagaInstanceAggregate,
  ): Promise<SagaInstanceAggregate> {
    const sagaInstanceData =
      this.sagaInstancePrismaMapper.toPrismaData(sagaInstance);

    const result = await this.prismaMasterService.client.sagaInstance.upsert({
      where: { id: sagaInstance.id.value },
      update: sagaInstanceData,
      create: sagaInstanceData,
    });

    return this.sagaInstancePrismaMapper.toDomainEntity(result);
  }

  /**
   * Deletes a saga instance
   *
   * @param sagaInstance - The saga instance to delete
   * @returns True if the saga instance was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting saga instance by id: ${id}`);

    await this.prismaMasterService.client.sagaInstance.delete({
      where: { id },
    });

    return true;
  }
}
