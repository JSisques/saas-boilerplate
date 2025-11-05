import { ISubscriptionFindByCriteriaQueryDto } from '@/billing-context/subscription/application/dtos/queries/subscription-find-by-criteria/subscription-find-by-criteria-query.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindSubscriptionsByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ISubscriptionFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
