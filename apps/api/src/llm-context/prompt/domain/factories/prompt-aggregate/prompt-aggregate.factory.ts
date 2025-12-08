import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { IPromptCreateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-create/prompt-create.dto';
import { PromptPrimitives } from '@/llm-context/prompt/domain/primitives/prompt.primitives';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory class responsible for creating PromptAggregate entities.
 *
 * @remarks
 * This class uses value objects to encapsulate and validate user information.
 */
@Injectable()
export class PromptAggregateFactory
  implements IWriteFactory<PromptAggregate, IPromptCreateDto>
{
  /**
   * Creates a new PromptAggregate entity using the provided properties.
   *
   * @param data   - The prompt create data.
   * @param data.id - The prompt id.
   * @param data.slug - The prompt slug.
   * @param data.version - The prompt version.
   * @param data.title - The prompt title.
   * @param data.description - The prompt description.
   * @param data.content - The prompt content.
   * @param data.status - The prompt status.
   * @param data.isActive - The prompt is active.
   * @param generateEvent - Whether to generate a creation event (default: true).
   * @returns {PromptAggregate} - The created prompt aggregate entity.
   */
  public create(
    data: IPromptCreateDto,
    generateEvent: boolean = true,
  ): PromptAggregate {
    return new PromptAggregate(data, generateEvent);
  }

  /**
   * Creates a new PromptAggregate entity from primitive data.
   *
   * @param data - The prompt primitive data.
   * @param data.id - The prompt id.
   * @param data.slug - The prompt slug.
   * @param data.version - The prompt version.
   * @param data.title - The prompt title.
   * @param data.description - The prompt description.
   * @param data.content - The prompt content.
   * @param data.status - The prompt status.
   * @param data.isActive - The prompt is active.
   * @returns The created prompt aggregate entity.
   */
  public fromPrimitives(data: PromptPrimitives): PromptAggregate {
    return new PromptAggregate(
      {
        id: new PromptUuidValueObject(data.id),
        slug: new PromptSlugValueObject(data.slug),
        version: new PromptVersionValueObject(data.version),
        title: new PromptTitleValueObject(data.title),
        description: data.description
          ? new PromptDescriptionValueObject(data.description)
          : null,
        content: new PromptContentValueObject(data.content),
        status: new PromptStatusValueObject(data.status),
        isActive: new PromptIsActiveValueObject(data.isActive),
        createdAt: new DateValueObject(data.createdAt),
        updatedAt: new DateValueObject(data.updatedAt),
      },
      false, // Don't generate events when recreating from primitives
    );
  }
}
