import { TenantDatabaseViewModelFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-view-model/tenant-database-view-model.factory';
import {
  TENANT_DATABASE_READ_REPOSITORY_TOKEN,
  TenantDatabaseReadRepository,
} from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantDatabaseViewModelByTenantIdQuery } from './tenant-database-find-view-model-by-tenant-id.query';

@QueryHandler(FindTenantDatabaseViewModelByTenantIdQuery)
export class FindTenantDatabaseViewModelByTenantIdQueryHandler
  implements IQueryHandler<FindTenantDatabaseViewModelByTenantIdQuery>
{
  private readonly logger = new Logger(
    FindTenantDatabaseViewModelByTenantIdQueryHandler.name,
  );

  constructor(
    @Inject(TENANT_DATABASE_READ_REPOSITORY_TOKEN)
    private readonly tenantDatabaseReadRepository: TenantDatabaseReadRepository,
    private readonly tenantDatabaseViewModelFactory: TenantDatabaseViewModelFactory,
  ) {}

  /**
   * Executes the FindTenantDatabaseViewModelByTenantIdQuery query.
   *
   * @param query - The FindTenantDatabaseViewModelByTenantIdQuery query to execute.
   * @returns The TenantDatabaseViewModels if found, null otherwise.
   */
  async execute(
    query: FindTenantDatabaseViewModelByTenantIdQuery,
  ): Promise<TenantDatabaseViewModel[] | null> {
    this.logger.log(
      `Executing find tenant database view model by tenant id query: ${query.tenantId.value}`,
    );

    // 01: Find the tenant databases by tenant id
    const tenantDatabases =
      await this.tenantDatabaseReadRepository.findByTenantId(
        query.tenantId.value,
      );

    return (
      tenantDatabases?.map((tenantDatabase) => {
        return this.tenantDatabaseViewModelFactory.fromPrimitives(
          tenantDatabase,
        );
      }) ?? []
    );
  }
}
