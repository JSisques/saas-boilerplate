import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
import { SagaStepTypeormEntity } from '@/saga-context/saga-step/infrastructure/database/typeorm/entities/saga-step-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepTypeormMapper {
  private readonly logger = new Logger(SagaStepTypeormMapper.name);

  constructor(
    private readonly sagaStepAggregateFactory: SagaStepAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a saga step aggregate
   *
   * @param sagaStepEntity - The TypeORM entity to convert
   * @returns The saga step aggregate
   */
  toDomainEntity(sagaStepEntity: SagaStepTypeormEntity): SagaStepAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${sagaStepEntity.id}`,
    );

    return this.sagaStepAggregateFactory.fromPrimitives({
      id: sagaStepEntity.id,
      sagaInstanceId: sagaStepEntity.sagaInstanceId,
      name: sagaStepEntity.name,
      order: sagaStepEntity.order,
      status: sagaStepEntity.status,
      startDate: sagaStepEntity.startDate ?? null,
      endDate: sagaStepEntity.endDate ?? null,
      errorMessage: sagaStepEntity.errorMessage ?? null,
      retryCount: sagaStepEntity.retryCount,
      maxRetries: sagaStepEntity.maxRetries,
      payload: sagaStepEntity.payload,
      result: sagaStepEntity.result,
      createdAt: sagaStepEntity.createdAt,
      updatedAt: sagaStepEntity.updatedAt,
    });
  }

  /**
   * Converts a saga step aggregate to a TypeORM entity
   *
   * @param sagaStep - The saga step aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(sagaStep: SagaStepAggregate): SagaStepTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${sagaStep.id.value} to TypeORM entity`,
    );

    const primitives = sagaStep.toPrimitives();

    const entity = new SagaStepTypeormEntity();

    entity.id = primitives.id;
    entity.sagaInstanceId = primitives.sagaInstanceId;
    entity.name = primitives.name;
    entity.order = primitives.order;
    entity.status = primitives.status as SagaStepStatusEnum;
    entity.startDate = primitives.startDate;
    entity.endDate = primitives.endDate;
    entity.errorMessage = primitives.errorMessage;
    entity.retryCount = primitives.retryCount;
    entity.maxRetries = primitives.maxRetries;
    entity.payload = primitives.payload;
    entity.result = primitives.result;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
