import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

/**
 * Data Transfer Object for creating a prompt.
 *
 * @interface IPromptCreateDto
 * @property {PromptUuidValueObject} id - The immutable identifier of the prompt.
 * @property {PromptSlugValueObject} slug - The slug of the prompt.
 * @property {PromptVersionValueObject} version - The version of the prompt.
 * @property {PromptTitleValueObject} title - The title of the prompt.
 * @property {PromptDescriptionValueObject | null} description - The description of the prompt.
 * @property {PromptContentValueObject} content - The content of the prompt.
 * @property {PromptStatusValueObject} status - The status of the prompt.
 * @property {PromptIsActiveValueObject} isActive - The is active of the prompt.
 */
export interface IPromptCreateDto extends IBaseAggregateDto {
  id: PromptUuidValueObject;
  slug: PromptSlugValueObject;
  version: PromptVersionValueObject;
  title: PromptTitleValueObject;
  description: PromptDescriptionValueObject | null;
  content: PromptContentValueObject;
  status: PromptStatusValueObject;
  isActive: PromptIsActiveValueObject;
}
