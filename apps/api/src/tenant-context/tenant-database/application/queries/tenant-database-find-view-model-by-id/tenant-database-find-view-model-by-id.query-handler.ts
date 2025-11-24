import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantDatabaseViewModelByIdQuery } from './tenant-database-find-view-model-by-id.query';

@QueryHandler(FindTenantDatabaseViewModelByIdQuery)
export class FindTenantDatabaseViewModelByIdQueryHandler
  implements IQueryHandler<FindTenantDatabaseViewModelByIdQuery>
{
  private readonly logger = new Logger(
    FindTenantDatabaseViewModelByIdQueryHandler.name,
  );

  constructor(
    private readonly assertTenantDatabaseViewModelExsistsService: AssertTenantDatabaseViewModelExsistsService,
  ) {}

  /**
   * Executes the FindTenantDatabaseViewModelByIdQuery query.
   *
   * @param query - The FindTenantDatabaseViewModelByIdQuery query to execute.
   * @returns The TenantDatabaseViewModel if found, null otherwise.
   */
  async execute(
    query: FindTenantDatabaseViewModelByIdQuery,
  ): Promise<TenantDatabaseViewModel> {
    this.logger.log(
      `Executing find tenant database view model by id query: ${query.id.value}`,
    );

    // 01: Assert the tenant database view model exists
    return await this.assertTenantDatabaseViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
