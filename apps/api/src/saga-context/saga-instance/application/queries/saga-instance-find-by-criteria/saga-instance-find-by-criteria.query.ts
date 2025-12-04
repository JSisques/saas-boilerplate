import { ISagaInstanceFindByCriteriaQueryDto } from '@/saga-context/saga-instance/application/dtos/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindSagaInstancesByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ISagaInstanceFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
