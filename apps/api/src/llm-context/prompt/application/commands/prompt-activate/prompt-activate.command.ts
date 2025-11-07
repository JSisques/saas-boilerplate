import { IPromptActivateCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-activate/prompt-activate-command.dto';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptActivateCommand {
  readonly id: PromptUuidValueObject;

  constructor(props: IPromptActivateCommandDto) {
    this.id = new PromptUuidValueObject(props.id);
  }
}
