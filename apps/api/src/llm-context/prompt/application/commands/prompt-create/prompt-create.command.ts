import { IPromptCreateCommandDto } from '@/llm-context/prompt/application/dtos/commands/prompt-create/prompt-create-command.dto';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

export class PromptCreateCommand {
  readonly id: PromptUuidValueObject;
  readonly slug: PromptSlugValueObject;
  readonly version: PromptVersionValueObject;
  readonly title: PromptTitleValueObject;
  readonly description: PromptDescriptionValueObject | null;
  readonly content: PromptContentValueObject;
  readonly status: PromptStatusValueObject;
  readonly isActive: PromptIsActiveValueObject;

  constructor(props: IPromptCreateCommandDto) {
    this.id = new PromptUuidValueObject();
    this.slug = new PromptSlugValueObject(props.title, {
      generateFromString: true,
    });
    this.version = new PromptVersionValueObject(1);
    this.title = new PromptTitleValueObject(props.title);
    this.description = new PromptDescriptionValueObject(props.description);
    this.content = new PromptContentValueObject(props.content);
    this.status = new PromptStatusValueObject(props.status);
    this.isActive = new PromptIsActiveValueObject(true);
  }
}
