import { Criteria } from '@/shared/domain/entities/criteria';
import { ITenantFindByCriteriaQueryDto } from '@/tenant-context/tenants/application/dtos/find-tenants-by-criteria/find-tenants-by-criteria-query.dto';

export class FindTenantsByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ITenantFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
