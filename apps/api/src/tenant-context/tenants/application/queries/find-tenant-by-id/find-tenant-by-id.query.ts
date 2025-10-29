import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { ITenantFindByIdQueryDto } from '@/tenant-context/tenants/application/dtos/find-tenant-by-id/find-tenant-by-id-query.dto';

export class FindTenantByIdQuery {
  readonly id: TenantUuidValueObject;

  constructor(props: ITenantFindByIdQueryDto) {
    this.id = new TenantUuidValueObject(props.id);
  }
}
