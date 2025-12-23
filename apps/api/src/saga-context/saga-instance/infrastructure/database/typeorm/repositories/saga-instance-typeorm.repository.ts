import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceWriteRepository } from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstanceTypeormEntity } from '@/saga-context/saga-instance/infrastructure/database/typeorm/entities/saga-instance-typeorm.entity';
import { SagaInstanceTypeormMapper } from '@/saga-context/saga-instance/infrastructure/database/typeorm/mappers/saga-instance-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstanceTypeormRepository
  extends BaseTypeormMasterRepository<SagaInstanceTypeormEntity>
  implements SagaInstanceWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly sagaInstanceTypeormMapper: SagaInstanceTypeormMapper,
  ) {
    super(typeormMasterService, SagaInstanceTypeormEntity);
    this.logger = new Logger(SagaInstanceTypeormRepository.name);
  }

  /**
   * Finds a saga instance by their id
   *
   * @param id - The id of the saga instance to find
   * @returns The saga instance if found, null otherwise
   */
  async findById(id: string): Promise<SagaInstanceAggregate | null> {
    this.logger.log(`Finding saga instance by id: ${id}`);
    const sagaInstanceEntity = await this.repository.findOne({
      where: { id },
    });

    return sagaInstanceEntity
      ? this.sagaInstanceTypeormMapper.toDomainEntity(sagaInstanceEntity)
      : null;
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
    this.logger.log(`Saving saga instance: ${sagaInstance.id.value}`);
    const sagaInstanceEntity =
      this.sagaInstanceTypeormMapper.toTypeormEntity(sagaInstance);

    const savedEntity = await this.repository.save(sagaInstanceEntity);

    return this.sagaInstanceTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a saga instance (soft delete)
   *
   * @param id - The id of the saga instance to delete
   * @returns True if the saga instance was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting saga instance by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
