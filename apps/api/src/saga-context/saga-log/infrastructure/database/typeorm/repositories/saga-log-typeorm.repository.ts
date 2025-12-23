import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogWriteRepository } from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogTypeormEntity } from '@/saga-context/saga-log/infrastructure/database/typeorm/entities/saga-log-typeorm.entity';
import { SagaLogTypeormMapper } from '@/saga-context/saga-log/infrastructure/database/typeorm/mappers/saga-log-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogTypeormRepository
  extends BaseTypeormMasterRepository<SagaLogTypeormEntity>
  implements SagaLogWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly sagaLogTypeormMapper: SagaLogTypeormMapper,
  ) {
    super(typeormMasterService, SagaLogTypeormEntity);
    this.logger = new Logger(SagaLogTypeormRepository.name);
  }

  /**
   * Finds a saga log by their id
   *
   * @param id - The id of the saga log to find
   * @returns The saga log if found, null otherwise
   */
  async findById(id: string): Promise<SagaLogAggregate | null> {
    this.logger.log(`Finding saga log by id: ${id}`);
    const sagaLogEntity = await this.repository.findOne({
      where: { id },
    });

    return sagaLogEntity
      ? this.sagaLogTypeormMapper.toDomainEntity(sagaLogEntity)
      : null;
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
    this.logger.log(`Finding saga logs by saga instance id: ${sagaInstanceId}`);
    const sagaLogEntities = await this.repository.find({
      where: { sagaInstanceId },
    });

    return sagaLogEntities.map((entity) =>
      this.sagaLogTypeormMapper.toDomainEntity(entity),
    );
  }

  /**
   * Finds saga logs by their saga step id
   *
   * @param sagaStepId - The saga step id of the saga logs to find
   * @returns The saga logs if found, empty array otherwise
   */
  async findBySagaStepId(sagaStepId: string): Promise<SagaLogAggregate[]> {
    this.logger.log(`Finding saga logs by saga step id: ${sagaStepId}`);
    const sagaLogEntities = await this.repository.find({
      where: { sagaStepId },
    });

    return sagaLogEntities.map((entity) =>
      this.sagaLogTypeormMapper.toDomainEntity(entity),
    );
  }

  /**
   * Saves a saga log
   *
   * @param sagaLog - The saga log to save
   * @returns The saved saga log
   */
  async save(sagaLog: SagaLogAggregate): Promise<SagaLogAggregate> {
    this.logger.log(`Saving saga log: ${sagaLog.id.value}`);
    const sagaLogEntity = this.sagaLogTypeormMapper.toTypeormEntity(sagaLog);

    const savedEntity = await this.repository.save(sagaLogEntity);

    return this.sagaLogTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a saga log (soft delete)
   *
   * @param id - The id of the saga log to delete
   * @returns True if the saga log was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting saga log by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
