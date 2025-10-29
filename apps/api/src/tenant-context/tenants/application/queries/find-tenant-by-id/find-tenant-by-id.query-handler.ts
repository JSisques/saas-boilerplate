import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import {
  TENANT_READ_REPOSITORY_TOKEN,
  TenantReadRepository,
} from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindTenantByIdQuery } from './find-tenant-by-id.query';

@QueryHandler(FindTenantByIdQuery)
export class FindTenantByIdQueryHandler
  implements IQueryHandler<FindTenantByIdQuery>
{
  private readonly logger = new Logger(FindTenantByIdQueryHandler.name);

  constructor(
    @Inject(TENANT_READ_REPOSITORY_TOKEN)
    private readonly tenantReadRepository: TenantReadRepository,
    private readonly assertTenantViewModelExsistsService: AssertTenantViewModelExsistsService,
  ) {}

  /**
   * Executes the FindTenantByIdQuery query.
   *
   * @param query - The FindTenantByIdQuery query to execute.
   * @returns The TenantViewModel if found, null otherwise.
   */
  async execute(query: FindTenantByIdQuery): Promise<TenantViewModel> {
    this.logger.log(`Executing find tenant by id query: ${query.id.value}`);

    // 01: Assert the tenant view model exists
    return await this.assertTenantViewModelExsistsService.execute(
      query.id.value,
    );
  }
}
