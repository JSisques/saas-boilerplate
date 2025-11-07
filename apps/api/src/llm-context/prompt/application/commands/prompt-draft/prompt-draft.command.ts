import { IPromptDraftCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-draft/prompt-draft-command.dto';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptDraftCommand {
  readonly id: PromptUuidValueObject;

  constructor(props: IPromptDraftCommandDto) {
    this.id = new PromptUuidValueObject(props.id);
  }
}
