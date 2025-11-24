import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { TenantDatabaseAggregate } from '@/tenant-context/tenant-database/domain/aggregates/tenant-database.aggregate';
import { ITenantDatabaseCreateViewModelDto } from '@/tenant-context/tenant-database/domain/dtos/view-models/tenant-database-create/tenant-database-create-view-model.dto';
import { TenantDatabasePrimitives } from '@/tenant-context/tenant-database/domain/primitives/tenant-database.primitives';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new tenant database view model.
 */
@Injectable()
export class TenantDatabaseViewModelFactory
  implements
    IReadFactory<
      TenantDatabaseViewModel,
      ITenantDatabaseCreateViewModelDto,
      TenantDatabaseAggregate,
      TenantDatabasePrimitives
    >
{
  private readonly logger = new Logger(TenantDatabaseViewModelFactory.name);

  /**
   * Creates a new tenant database view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created tenant database view model.
   */
  public create(
    data: ITenantDatabaseCreateViewModelDto,
  ): TenantDatabaseViewModel {
    this.logger.log(`Creating tenant database view model from DTO: ${data}`);
    return new TenantDatabaseViewModel(data);
  }

  /**
   * Creates a new tenant database view model from a tenant database primitive.
   *
   * @param tenantDatabasePrimitives - The tenant database primitive to create the view model from.
   * @returns The tenant database view model.
   */
  fromPrimitives(
    tenantDatabasePrimitives: TenantDatabasePrimitives,
  ): TenantDatabaseViewModel {
    this.logger.log(
      `Creating tenant database view model from primitives: ${tenantDatabasePrimitives}`,
    );

    return new TenantDatabaseViewModel({
      id: tenantDatabasePrimitives.id,
      tenantId: tenantDatabasePrimitives.tenantId,
      databaseName: tenantDatabasePrimitives.databaseName,
      databaseUrl: tenantDatabasePrimitives.databaseUrl,
      status: tenantDatabasePrimitives.status,
      schemaVersion: tenantDatabasePrimitives.schemaVersion,
      lastMigrationAt: tenantDatabasePrimitives.lastMigrationAt,
      errorMessage: tenantDatabasePrimitives.errorMessage,
      createdAt: tenantDatabasePrimitives.createdAt,
      updatedAt: tenantDatabasePrimitives.updatedAt,
    });
  }
  /**
   * Creates a new tenant database view model from a tenant database aggregate.
   *
   * @param tenantDatabaseAggregate - The tenant database aggregate to create the view model from.
   * @returns The tenant database view model.
   */
  fromAggregate(
    tenantDatabaseAggregate: TenantDatabaseAggregate,
  ): TenantDatabaseViewModel {
    this.logger.log(
      `Creating tenant database view model from aggregate: ${tenantDatabaseAggregate}`,
    );

    return new TenantDatabaseViewModel({
      id: tenantDatabaseAggregate.id.value,
      tenantId: tenantDatabaseAggregate.tenantId.value,
      databaseName: tenantDatabaseAggregate.databaseName.value,
      databaseUrl: tenantDatabaseAggregate.databaseUrl.value,
      status: tenantDatabaseAggregate.status.value,
      schemaVersion: tenantDatabaseAggregate.schemaVersion.value,
      lastMigrationAt: tenantDatabaseAggregate.lastMigrationAt.value,
      errorMessage: tenantDatabaseAggregate.errorMessage.value,
      createdAt: tenantDatabaseAggregate.createdAt.value,
      updatedAt: tenantDatabaseAggregate.updatedAt.value,
    });
  }
}
