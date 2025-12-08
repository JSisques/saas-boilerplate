import { IPromptChangeStatusCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-change-status/prompt-change-status-command.dto';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptChangeStatusCommand {
  readonly id: PromptUuidValueObject;
  readonly status: PromptStatusValueObject;

  constructor(props: IPromptChangeStatusCommandDto) {
    this.id = new PromptUuidValueObject(props.id);
    this.status = new PromptStatusValueObject(props.status);
  }
}
