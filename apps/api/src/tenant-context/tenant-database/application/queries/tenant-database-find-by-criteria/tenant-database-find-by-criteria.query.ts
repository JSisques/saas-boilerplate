import { Criteria } from '@/shared/domain/entities/criteria';
import { ITenantDatabaseFindByCriteriaQueryDto } from '@/tenant-context/tenant-database/application/dtos/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.dto';

export class FindTenantDatabasesByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ITenantDatabaseFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
