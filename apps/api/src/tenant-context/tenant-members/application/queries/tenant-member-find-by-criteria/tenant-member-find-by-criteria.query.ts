import { Criteria } from '@/shared/domain/entities/criteria';
import { ITenantMemberFindByCriteriaQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-by-criteria/tenant-member-find-by-criteria.dto';

export class FindTenantMembersByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ITenantMemberFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
