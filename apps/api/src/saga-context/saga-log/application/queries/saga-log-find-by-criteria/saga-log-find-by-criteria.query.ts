import { ISagaLogFindByCriteriaQueryDto } from '@/saga-context/saga-log/application/dtos/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindSagaLogsByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ISagaLogFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
