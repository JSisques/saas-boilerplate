import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import { SagaInstanceTypeormEntity } from '@/saga-context/saga-instance/infrastructure/database/typeorm/entities/saga-instance-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstanceTypeormMapper {
  private readonly logger = new Logger(SagaInstanceTypeormMapper.name);

  constructor(
    private readonly sagaInstanceAggregateFactory: SagaInstanceAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a saga instance aggregate
   *
   * @param sagaInstanceEntity - The TypeORM entity to convert
   * @returns The saga instance aggregate
   */
  toDomainEntity(
    sagaInstanceEntity: SagaInstanceTypeormEntity,
  ): SagaInstanceAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${sagaInstanceEntity.id}`,
    );

    return this.sagaInstanceAggregateFactory.fromPrimitives({
      id: sagaInstanceEntity.id,
      name: sagaInstanceEntity.name,
      status: sagaInstanceEntity.status,
      startDate: sagaInstanceEntity.startDate ?? null,
      endDate: sagaInstanceEntity.endDate ?? null,
      createdAt: sagaInstanceEntity.createdAt,
      updatedAt: sagaInstanceEntity.updatedAt,
    });
  }

  /**
   * Converts a saga instance aggregate to a TypeORM entity
   *
   * @param sagaInstance - The saga instance aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(
    sagaInstance: SagaInstanceAggregate,
  ): SagaInstanceTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${sagaInstance.id.value} to TypeORM entity`,
    );

    const primitives = sagaInstance.toPrimitives();

    const entity = new SagaInstanceTypeormEntity();

    entity.id = primitives.id;
    entity.name = primitives.name;
    entity.status = primitives.status as SagaInstanceStatusEnum;
    entity.startDate = primitives.startDate;
    entity.endDate = primitives.endDate;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
