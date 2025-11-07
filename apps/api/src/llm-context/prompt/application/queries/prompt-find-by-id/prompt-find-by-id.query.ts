import { IPromptFindByIdQueryDto } from '@/llm-context/prompt/application/dtos/queries/prompt-find-by-id/prompt-find-by-id-query.dto';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class FindPromptByIdQuery {
  readonly id: PromptUuidValueObject;

  constructor(props: IPromptFindByIdQueryDto) {
    this.id = new PromptUuidValueObject(props.id);
  }
}
