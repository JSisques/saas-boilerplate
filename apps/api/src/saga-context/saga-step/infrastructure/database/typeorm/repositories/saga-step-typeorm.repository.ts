import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepWriteRepository } from '@/saga-context/saga-step/domain/repositories/saga-step-write.repository';
import { SagaStepTypeormEntity } from '@/saga-context/saga-step/infrastructure/database/typeorm/entities/saga-step-typeorm.entity';
import { SagaStepTypeormMapper } from '@/saga-context/saga-step/infrastructure/database/typeorm/mappers/saga-step-typeorm.mapper';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepTypeormRepository
  extends BaseTypeormMasterRepository<SagaStepTypeormEntity>
  implements SagaStepWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly sagaStepTypeormMapper: SagaStepTypeormMapper,
  ) {
    super(typeormMasterService, SagaStepTypeormEntity);
    this.logger = new Logger(SagaStepTypeormRepository.name);
  }

  /**
   * Finds a saga step by their id
   *
   * @param id - The id of the saga step to find
   * @returns The saga step if found, null otherwise
   */
  async findById(id: string): Promise<SagaStepAggregate | null> {
    this.logger.log(`Finding saga step by id: ${id}`);
    const sagaStepEntity = await this.repository.findOne({
      where: { id },
    });

    return sagaStepEntity
      ? this.sagaStepTypeormMapper.toDomainEntity(sagaStepEntity)
      : null;
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
    this.logger.log(
      `Finding saga steps by saga instance id: ${sagaInstanceId}`,
    );
    const sagaStepEntities = await this.repository.find({
      where: { sagaInstanceId },
    });

    return sagaStepEntities.map((entity) =>
      this.sagaStepTypeormMapper.toDomainEntity(entity),
    );
  }

  /**
   * Saves a saga step
   *
   * @param sagaStep - The saga step to save
   * @returns The saved saga step
   */
  async save(sagaStep: SagaStepAggregate): Promise<SagaStepAggregate> {
    this.logger.log(`Saving saga step: ${sagaStep.id.value}`);
    const sagaStepEntity = this.sagaStepTypeormMapper.toTypeormEntity(sagaStep);

    const savedEntity = await this.repository.save(sagaStepEntity);

    return this.sagaStepTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a saga step (soft delete)
   *
   * @param id - The id of the saga step to delete
   * @returns True if the saga step was deleted, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    this.logger.log(`Soft deleting saga step by id: ${id}`);

    const result = await this.repository.softDelete(id);

    return result.affected !== undefined && result.affected > 0;
  }
}
