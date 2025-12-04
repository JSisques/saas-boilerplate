import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import { SagaLogPrismaDto } from '@/saga-context/saga-log/infrastructure/database/prisma/dtos/saga-log-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaLogPrismaMapper {
  private readonly logger = new Logger(SagaLogPrismaMapper.name);

  constructor(
    private readonly sagaLogAggregateFactory: SagaLogAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a saga log aggregate
   *
   * @param sagaLogData - The Prisma data to convert
   * @returns The saga log aggregate
   */
  toDomainEntity(sagaLogData: SagaLogPrismaDto): SagaLogAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${sagaLogData.id}`,
    );

    return this.sagaLogAggregateFactory.fromPrimitives({
      id: sagaLogData.id,
      sagaInstanceId: sagaLogData.sagaInstanceId,
      sagaStepId: sagaLogData.sagaStepId,
      type: sagaLogData.type,
      message: sagaLogData.message,
      createdAt: sagaLogData.createdAt,
      updatedAt: sagaLogData.updatedAt,
    });
  }

  /**
   * Converts a saga log aggregate to a Prisma data
   *
   * @param sagaLog - The saga log aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(sagaLog: SagaLogAggregate): SagaLogPrismaDto {
    this.logger.log(
      `Converting domain entity with id ${sagaLog.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = sagaLog.toPrimitives();

    return {
      id: primitives.id,
      sagaInstanceId: primitives.sagaInstanceId,
      sagaStepId: primitives.sagaStepId,
      type: primitives.type,
      message: primitives.message,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
