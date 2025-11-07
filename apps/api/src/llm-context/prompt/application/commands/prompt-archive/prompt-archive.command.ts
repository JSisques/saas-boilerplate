import { IPromptArchiveCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-archive/prompt-archive-command.dto';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptArchiveCommand {
  readonly id: PromptUuidValueObject;

  constructor(props: IPromptArchiveCommandDto) {
    this.id = new PromptUuidValueObject(props.id);
  }
}
