import { TenantDatabaseUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-database-uuid/tenant-database-uuid.vo';
import { ITenantDatabaseFindViewModelByIdQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-view-model-by-id/tenant-database-find-view-model-by-id.dto';

export class FindTenantDatabaseViewModelByIdQuery {
  readonly id: TenantDatabaseUuidValueObject;

  constructor(props: ITenantDatabaseFindViewModelByIdQueryDto) {
    this.id = new TenantDatabaseUuidValueObject(props.id);
  }
}
