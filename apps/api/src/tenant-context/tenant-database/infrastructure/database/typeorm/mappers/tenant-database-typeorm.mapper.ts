import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseStatusEnum } from '@/tenant-context/tenant-database/domain/enums/tenant-database-status/tenant-database-status.enum';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import { TenantDatabaseTypeormEntity } from '@/tenant-context/tenant-database/infrastructure/database/typeorm/entities/tenant-database-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TenantDatabaseTypeormMapper {
  private readonly logger = new Logger(TenantDatabaseTypeormMapper.name);

  constructor(
    private readonly tenantDatabaseAggregateFactory: TenantDatabaseAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a tenant database aggregate
   *
   * @param tenantDatabaseEntity - The TypeORM entity to convert
   * @returns The tenant database aggregate
   */
  toDomainEntity(
    tenantDatabaseEntity: TenantDatabaseTypeormEntity,
  ): TenantDatabaseAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${tenantDatabaseEntity.id}`,
    );

    return this.tenantDatabaseAggregateFactory.fromPrimitives({
      id: tenantDatabaseEntity.id,
      tenantId: tenantDatabaseEntity.tenantId,
      databaseName: tenantDatabaseEntity.databaseName,
      readDatabaseName: tenantDatabaseEntity.readDatabaseName,
      status: tenantDatabaseEntity.status,
      schemaVersion: tenantDatabaseEntity.schemaVersion ?? null,
      lastMigrationAt: tenantDatabaseEntity.lastMigrationAt ?? null,
      errorMessage: tenantDatabaseEntity.errorMessage ?? null,
      createdAt: tenantDatabaseEntity.createdAt,
      updatedAt: tenantDatabaseEntity.updatedAt,
    });
  }

  /**
   * Converts a tenant database aggregate to a TypeORM entity
   *
   * @param tenantDatabase - The tenant database aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(
    tenantDatabase: TenantDatabaseAggregate,
  ): TenantDatabaseTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${tenantDatabase.id.value} to TypeORM entity`,
    );

    const primitives = tenantDatabase.toPrimitives();

    const entity = new TenantDatabaseTypeormEntity();

    entity.id = primitives.id;
    entity.tenantId = primitives.tenantId;
    entity.databaseName = primitives.databaseName;
    entity.readDatabaseName = primitives.readDatabaseName;
    entity.status = primitives.status as TenantDatabaseStatusEnum;
    entity.schemaVersion = primitives.schemaVersion;
    entity.lastMigrationAt = primitives.lastMigrationAt;
    entity.errorMessage = primitives.errorMessage;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
