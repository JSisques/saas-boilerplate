import { ISagaStepFindByCriteriaQueryDto } from '@/saga-context/saga-step/application/dtos/queries/saga-step-find-by-criteria/saga-step-find-by-criteria.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindSagaStepsByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: ISagaStepFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
