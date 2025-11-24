import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import { TenantDatabasePrismaDto } from '@/tenant-context/tenant-database/infrastructure/database/prisma/dtos/tenant-database-prisma.dto';
import { Injectable, Logger } from '@nestjs/common';
import { TenantDatabaseStatusEnum } from '@prisma/client';

@Injectable()
export class TenantDatabasePrismaMapper {
  private readonly logger = new Logger(TenantDatabasePrismaMapper.name);

  constructor(
    private readonly tenantDatabaseAggregateFactory: TenantDatabaseAggregateFactory,
  ) {}

  /**
   * Converts a Prisma data to a tenant database aggregate
   *
   * @param tenantDatabaseData - The Prisma data to convert
   * @returns The tenant database aggregate
   */
  toDomainEntity(
    tenantDatabaseData: TenantDatabasePrismaDto,
  ): TenantDatabaseAggregate {
    this.logger.log(
      `Converting Prisma data to domain entity with id ${tenantDatabaseData.id}`,
    );

    return this.tenantDatabaseAggregateFactory.fromPrimitives({
      id: tenantDatabaseData.id,
      tenantId: tenantDatabaseData.tenantId,
      databaseName: tenantDatabaseData.databaseName,
      databaseUrl: tenantDatabaseData.databaseUrl,
      status: tenantDatabaseData.status,
      schemaVersion: tenantDatabaseData.schemaVersion,
      lastMigrationAt: tenantDatabaseData.lastMigrationAt,
      errorMessage: tenantDatabaseData.errorMessage,
      createdAt: tenantDatabaseData.createdAt,
      updatedAt: tenantDatabaseData.updatedAt,
    });
  }

  /**
   * Converts a tenant database aggregate to a Prisma data
   *
   * @param tenantDatabase - The tenant database aggregate to convert
   * @returns The Prisma data
   */
  public toPrismaData(
    tenantDatabase: TenantDatabaseAggregate,
  ): TenantDatabasePrismaDto {
    this.logger.log(
      `Converting domain entity with id ${tenantDatabase.id.value} to Prisma data`,
    );

    // Get primitives from aggregate
    const primitives = tenantDatabase.toPrimitives();

    return {
      id: primitives.id,
      tenantId: primitives.tenantId,
      databaseName: primitives.databaseName,
      databaseUrl: primitives.databaseUrl,
      status: primitives.status as TenantDatabaseStatusEnum,
      schemaVersion: primitives.schemaVersion,
      lastMigrationAt: primitives.lastMigrationAt,
      errorMessage: primitives.errorMessage,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
