import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantDatabaseViewModelFindByTenantIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-view-model-find-by-tenant-id/tenant-database-view-model-find-by-tenant-id.dto';

export class FindTenantDatabaseViewModelByTenantIdQuery {
  readonly tenantId: TenantUuidValueObject;

  constructor(props: ITenantDatabaseViewModelFindByTenantIdQueryDto) {
    this.tenantId = new TenantUuidValueObject(props.tenantId);
  }
}
