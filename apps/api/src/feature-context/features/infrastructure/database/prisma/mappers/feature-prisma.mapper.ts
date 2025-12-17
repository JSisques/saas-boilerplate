import { FeatureStatusEnum } from '@/prisma/master/client';
import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import { FeaturePrismaDto } from '@/feature-context/features/infrastructure/database/prisma/dtos/feature-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeaturePrismaMapper {
  private readonly logger = new Logger(FeaturePrismaMapper.name);

  constructor(
    private readonly featureAggregateFactory: FeatureAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a feature aggregate
   *
   * @param featureData - The Prisma data to convert
   * @returns The feature aggregate
   */
  toDomainEntity(featureData: FeaturePrismaDto): FeatureAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${featureData.id}`,
    );

    return this.featureAggregateFactory.fromPrimitives({
      id: featureData.id,
      key: featureData.key,
      name: featureData.name,
      description: featureData.description ?? null,
      status: featureData.status,
      createdAt: featureData.createdAt,
      updatedAt: featureData.updatedAt,
    });
  }

  /**
   * Converts a feature aggregate to a Prisma data
   *
   * @param feature - The feature aggregate to convert
   * @returns The Prisma data
   */
  toPrismaData(feature: FeatureAggregate): FeaturePrismaDto {
    this.logger.log(
      `Converting domain entity with id ${feature.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = feature.toPrimitives();

    return {
      id: primitives.id,
      key: primitives.key,
      name: primitives.name,
      description: primitives.description,
      status: primitives.status as FeatureStatusEnum,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
