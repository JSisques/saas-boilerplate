import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import { SagaLogTypeormEntity } from '@/saga-context/saga-log/infrastructure/database/typeorm/entities/saga-log-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogTypeormMapper {
  private readonly logger = new Logger(SagaLogTypeormMapper.name);

  constructor(
    private readonly sagaLogAggregateFactory: SagaLogAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a saga log aggregate
   *
   * @param sagaLogEntity - The TypeORM entity to convert
   * @returns The saga log aggregate
   */
  toDomainEntity(sagaLogEntity: SagaLogTypeormEntity): SagaLogAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${sagaLogEntity.id}`,
    );

    return this.sagaLogAggregateFactory.fromPrimitives({
      id: sagaLogEntity.id,
      sagaInstanceId: sagaLogEntity.sagaInstanceId,
      sagaStepId: sagaLogEntity.sagaStepId,
      type: sagaLogEntity.type,
      message: sagaLogEntity.message,
      createdAt: sagaLogEntity.createdAt,
      updatedAt: sagaLogEntity.updatedAt,
    });
  }

  /**
   * Converts a saga log aggregate to a TypeORM entity
   *
   * @param sagaLog - The saga log aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(sagaLog: SagaLogAggregate): SagaLogTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${sagaLog.id.value} to TypeORM entity`,
    );

    const primitives = sagaLog.toPrimitives();

    const entity = new SagaLogTypeormEntity();

    entity.id = primitives.id;
    entity.sagaInstanceId = primitives.sagaInstanceId;
    entity.sagaStepId = primitives.sagaStepId;
    entity.type = primitives.type as SagaLogTypeEnum;
    entity.message = primitives.message;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
