import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { ITenantDatabaseFindByIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-by-id/tenant-database-find-by-id.dto';

export class FindTenantDatabaseByIdQuery {
  readonly id: TenantDatabaseUuidValueObject;

  constructor(props: ITenantDatabaseFindByIdQueryDto) {
    this.id = new TenantDatabaseUuidValueObject(props.id);
  }
}
