import { IPromptDeleteCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-delete/prompt-delete-command.dto';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptDeleteCommand {
  readonly id: PromptUuidValueObject;

  constructor(props: IPromptDeleteCommandDto) {
    this.id = new PromptUuidValueObject(props.id);
  }
}
