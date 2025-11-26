import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantDatabaseFindByTenantIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-by-tenant-id/tenant-database-find-by-tenant-id.dto';

export class FindTenantDatabaseByTenantIdQuery {
  readonly tenantId: TenantUuidValueObject;

  constructor(props: ITenantDatabaseFindByTenantIdQueryDto) {
    this.tenantId = new TenantUuidValueObject(props.tenantId);
  }
}
