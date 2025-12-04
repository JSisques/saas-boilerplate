import { SagaStepAggregate } from '@/saga-context/saga-step/domain/aggregates/saga-step.aggregate';
import { SagaStepAggregateFactory } from '@/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory';
import { SagaStepPrismaDto } from '@/saga-context/saga-step/infrastructure/database/prisma/dtos/saga-step-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaStepPrismaMapper {
  private readonly logger = new Logger(SagaStepPrismaMapper.name);

  constructor(
    private readonly sagaStepAggregateFactory: SagaStepAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a saga step aggregate
   *
   * @param sagaStepData - The Prisma data to convert
   * @returns The saga step aggregate
   */
  toDomainEntity(sagaStepData: SagaStepPrismaDto): SagaStepAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${sagaStepData.id}`,
    );

    return this.sagaStepAggregateFactory.fromPrimitives({
      id: sagaStepData.id,
      sagaInstanceId: sagaStepData.sagaInstanceId,
      name: sagaStepData.name,
      order: sagaStepData.order,
      status: sagaStepData.status,
      startDate: sagaStepData.startDate,
      endDate: sagaStepData.endDate,
      errorMessage: sagaStepData.errorMessage,
      retryCount: sagaStepData.retryCount,
      maxRetries: sagaStepData.maxRetries,
      payload: sagaStepData.payload,
      result: sagaStepData.result,
      createdAt: sagaStepData.createdAt,
      updatedAt: sagaStepData.updatedAt,
    });
  }

  /**
   * Converts a saga step aggregate to a Prisma data
   *
   * @param sagaStep - The saga step aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(sagaStep: SagaStepAggregate): SagaStepPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${sagaStep.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = sagaStep.toPrimitives();

    return {
      id: primitives.id,
      sagaInstanceId: primitives.sagaInstanceId,
      name: primitives.name,
      order: primitives.order,
      status: primitives.status,
      startDate: primitives.startDate,
      endDate: primitives.endDate,
      errorMessage: primitives.errorMessage,
      retryCount: primitives.retryCount,
      maxRetries: primitives.maxRetries,
      payload: primitives.payload,
      result: primitives.result,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
