import { IPromptFindByCriteriaQueryDto } from '@/llm-context/prompt/application/dtos/queries/prompt-find-by-criteria/prompt-find-by-criteria-query.dto';
import { Criteria } from '@/shared/domain/entities/criteria';

export class FindPromptsByCriteriaQuery {
  readonly criteria: Criteria;

  constructor(props: IPromptFindByCriteriaQueryDto) {
    this.criteria = props.criteria;
  }
}
