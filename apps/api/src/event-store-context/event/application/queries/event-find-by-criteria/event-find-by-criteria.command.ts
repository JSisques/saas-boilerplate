import { IEventFindByCriteriaQueryDto } from '@/event-store-context/event/application/dtos/queries/event-find-by-criteria-query.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindEventsByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: IEventFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
