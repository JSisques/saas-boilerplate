import { ISubscriptionPlanFindByCriteriaQueryDto } from '@/billing-context/subscription-plan/application/dtos/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria-query.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindSubscriptionPlansByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ISubscriptionPlanFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
