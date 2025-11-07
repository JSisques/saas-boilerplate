import { IPromptCreateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-create/prompt-create.dto';
import { IPromptUpdateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-update/prompt-update.dto';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptPrimitives } from '@/llm-context/prompt/domain/primitives/prompt.primitives';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { PromptActivatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-activated/prompt-activated.event';
import { PromptArchivedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-archived/prompt-activated.event';
import { PromptCreatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-created/prompt-created.event';
import { PromptDeletedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deleted/prompt-deleted.event';
import { PromptDeprecatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deprecated/prompt-deprecated.event';
import { PromptDraftedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-drafted/prompt-drafted.event';
import { PromptUpdatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-updated/prompt-updated.event';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class PromptAggregate extends AggregateRoot {
  private readonly _id: PromptUuidValueObject;
  private _slug: PromptSlugValueObject;
  private _version: PromptVersionValueObject;
  private _title: PromptTitleValueObject;
  private _description: PromptDescriptionValueObject | null;
  private _content: PromptContentValueObject;
  private _status: PromptStatusValueObject;
  private _isActive: PromptIsActiveValueObject;

  constructor(props: IPromptCreateDto, generateEvent: boolean = true) {
    super();

    this._id = props.id;
    this._slug = props.slug;
    this._version = props.version;
    this._title = props.title;
    this._description = props.description;
    this._content = props.content;
    this._status = props.status;
    this._isActive = props.isActive;

    if (generateEvent) {
      this.apply(
        new PromptCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the prompt.
   *
   * @param props - The properties to update.
   * @param generateEvent - Whether to generate an event.
   */
  public update(props: IPromptUpdateDto, generateEvent: boolean = true): void {
    this._slug = props.slug !== undefined ? props.slug : this._slug;
    this._version = props.version !== undefined ? props.version : this._version;
    this._title = props.title !== undefined ? props.title : this._title;
    this._description =
      props.description !== undefined ? props.description : this._description;
    this._content = props.content !== undefined ? props.content : this._content;
    this._status = props.status !== undefined ? props.status : this._status;
    this._isActive =
      props.isActive !== undefined ? props.isActive : this._isActive;

    if (generateEvent) {
      this.apply(
        new PromptUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public delete(generateEvent: boolean = true): void {
    if (generateEvent) {
      this.apply(
        new PromptDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Activate the subscription.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public activate(generateEvent: boolean = true): void {
    this._status = new PromptStatusValueObject(PromptStatusEnum.ACTIVE);
    if (generateEvent) {
      this.apply(
        new PromptActivatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptActivatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Deactivate the prompt.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public draft(generateEvent: boolean = true): void {
    this._status = new PromptStatusValueObject(PromptStatusEnum.DRAFT);
    if (generateEvent) {
      this.apply(
        new PromptDraftedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptDraftedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Archive the prompt.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public archive(generateEvent: boolean = true): void {
    this._status = new PromptStatusValueObject(PromptStatusEnum.ARCHIVED);
    if (generateEvent) {
      this.apply(
        new PromptArchivedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptArchivedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Deprecate the prompt.
   *
   * @param generateEvent - Whether to generate an event.
   */
  public deprecate(generateEvent: boolean = true): void {
    this._status = new PromptStatusValueObject(PromptStatusEnum.DEPRECATED);
    if (generateEvent) {
      this.apply(
        new PromptDeprecatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PromptAggregate.name,
            eventType: PromptDeprecatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Gets the unique identifier of the prompt.
   * @returns {PromptUuidValueObject} The prompt UUID value object.
   */
  public get id(): PromptUuidValueObject {
    return this._id;
  }

  /**
   * Gets the slug of the prompt.
   * @returns {PromptSlugValueObject} The slug of the prompt.
   */
  public get slug(): PromptSlugValueObject {
    return this._slug;
  }

  /**
   * Gets the version of the prompt.
   * @returns {PromptVersionValueObject} The version of the prompt.
   */
  public get version(): PromptVersionValueObject {
    return this._version;
  }

  /**
   * Gets the title of the prompt.
   * @returns {PromptTitleValueObject} The title of the prompt.
   */
  public get title(): PromptTitleValueObject {
    return this._title;
  }

  /**
   * Gets the description of the prompt.
   * @returns {PromptDescriptionValueObject | null} The description of the prompt.
   */
  public get description(): PromptDescriptionValueObject | null {
    return this._description;
  }

  /**
   * Gets the content of the prompt.
   * @returns {PromptContentValueObject} The content of the prompt.
   */
  public get content(): PromptContentValueObject {
    return this._content;
  }

  /**
   * Gets the status of the prompt.
   * @returns {PromptStatusValueObject} The status of the prompt.
   */
  public get status(): PromptStatusValueObject {
    return this._status;
  }

  /**
   * Gets the is active of the prompt.
   * @returns {PromptIsActiveValueObject} The is active of the prompt.
   */
  public get isActive(): PromptIsActiveValueObject {
    return this._isActive;
  }

  /**
   * Converts the prompt aggregate to its primitive representation.
   * @returns {PromptPrimitives} The primitive representation of the prompt.
   */
  public toPrimitives(): PromptPrimitives {
    return {
      id: this._id.value,
      slug: this._slug.value,
      version: this._version.value,
      title: this._title.value,
      description: this._description ? this._description.value : null,
      content: this._content.value,
      status: this._status.value,
      isActive: this._isActive.value,
    };
  }
}
