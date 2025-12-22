import { FeatureAggregate } from '@/feature-context/features/domain/aggregates/feature.aggregate';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';
import { FeatureAggregateFactory } from '@/feature-context/features/domain/factories/feature-aggregate/feature-aggregate.factory';
import { FeatureTypeormEntity } from '@/feature-context/features/infrastructure/database/typeorm/entities/feature-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureTypeormMapper {
  private readonly logger = new Logger(FeatureTypeormMapper.name);

  constructor(
    private readonly featureAggregateFactory: FeatureAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a feature aggregate
   *
   * @param featureEntity - The TypeORM entity to convert
   * @returns The feature aggregate
   */
  toDomainEntity(featureEntity: FeatureTypeormEntity): FeatureAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${featureEntity.id}`,
    );

    return this.featureAggregateFactory.fromPrimitives({
      id: featureEntity.id,
      key: featureEntity.key,
      name: featureEntity.name,
      description: featureEntity.description ?? null,
      status: featureEntity.status,
      createdAt: featureEntity.createdAt,
      updatedAt: featureEntity.updatedAt,
    });
  }

  /**
   * Converts a feature aggregate to a TypeORM entity
   *
   * @param feature - The feature aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(feature: FeatureAggregate): FeatureTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${feature.id.value} to TypeORM entity`,
    );

    const primitives = feature.toPrimitives();

    const entity = new FeatureTypeormEntity();

    entity.id = primitives.id;
    entity.key = primitives.key;
    entity.name = primitives.name;
    entity.description = primitives.description;
    entity.status = primitives.status as FeatureStatusEnum;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
