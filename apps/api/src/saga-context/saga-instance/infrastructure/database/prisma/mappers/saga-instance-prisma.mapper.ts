import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import { SagaInstancePrismaDto } from '@/saga-context/saga-instance/infrastructure/database/prisma/dtos/saga-instance-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SagaInstancePrismaMapper {
  private readonly logger = new Logger(SagaInstancePrismaMapper.name);

  constructor(
    private readonly sagaInstanceAggregateFactory: SagaInstanceAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a saga instance aggregate
   *
   * @param sagaInstanceData - The Prisma data to convert
   * @returns The saga instance aggregate
   */
  toDomainEntity(
    sagaInstanceData: SagaInstancePrismaDto,
  ): SagaInstanceAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${sagaInstanceData.id}`,
    );

    return this.sagaInstanceAggregateFactory.fromPrimitives({
      id: sagaInstanceData.id,
      name: sagaInstanceData.name,
      status: sagaInstanceData.status,
      startDate: sagaInstanceData.startDate,
      endDate: sagaInstanceData.endDate,
      createdAt: sagaInstanceData.createdAt,
      updatedAt: sagaInstanceData.updatedAt,
    });
  }

  /**
   * Converts a saga instance aggregate to a Prisma data
   *
   * @param sagaInstance - The saga instance aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(sagaInstance: SagaInstanceAggregate): SagaInstancePrismaDto {
    this.logger.log(
      `Converting domain entity with id ${sagaInstance.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = sagaInstance.toPrimitives();

    return {
      id: primitives.id,
      name: primitives.name,
      status: primitives.status,
      startDate: primitives.startDate,
      endDate: primitives.endDate,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
