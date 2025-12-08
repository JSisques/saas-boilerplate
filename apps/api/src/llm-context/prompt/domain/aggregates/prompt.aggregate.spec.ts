import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { IPromptCreateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-create/prompt-create.dto';
import { IPromptUpdateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-update/prompt-update.dto';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
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
import { PromptVersionIncrementedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-version-incremented/prompt-version-incremented.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

describe('PromptAggregate', () => {
  const createBaseAggregate = (
    generateEvent: boolean = false,
  ): PromptAggregate => {
    const now = new Date();
    const dto: IPromptCreateDto = {
      id: new PromptUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      slug: new PromptSlugValueObject('test-prompt'),
      version: new PromptVersionValueObject(1),
      title: new PromptTitleValueObject('Test Prompt'),
      description: new PromptDescriptionValueObject('Test description'),
      content: new PromptContentValueObject('Test content'),
      status: new PromptStatusValueObject(PromptStatusEnum.DRAFT),
      isActive: new PromptIsActiveValueObject(true),
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    };

    return new PromptAggregate(dto, generateEvent);
  };

  describe('constructor', () => {
    it('should create a PromptAggregate with all properties', () => {
      const aggregate = createBaseAggregate(false);

      expect(aggregate).toBeInstanceOf(PromptAggregate);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(aggregate.slug.value).toBe('test-prompt');
      expect(aggregate.version.value).toBe(1);
      expect(aggregate.title.value).toBe('Test Prompt');
      expect(aggregate.description?.value).toBe('Test description');
      expect(aggregate.content.value).toBe('Test content');
      expect(aggregate.status.value).toBe(PromptStatusEnum.DRAFT);
      expect(aggregate.isActive.value).toBe(true);
    });

    it('should emit PromptCreatedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptCreatedEvent);
      const event = events[0] as PromptCreatedEvent;
      expect(event.aggregateId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should not emit event when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });

    it('should create aggregate with null description', () => {
      const now = new Date();
      const dto: IPromptCreateDto = {
        id: new PromptUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        slug: new PromptSlugValueObject('test-prompt'),
        version: new PromptVersionValueObject(1),
        title: new PromptTitleValueObject('Test Prompt'),
        description: null,
        content: new PromptContentValueObject('Test content'),
        status: new PromptStatusValueObject(PromptStatusEnum.DRAFT),
        isActive: new PromptIsActiveValueObject(true),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = new PromptAggregate(dto, false);
      expect(aggregate.description).toBeNull();
    });
  });

  describe('update', () => {
    it('should update prompt properties', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: IPromptUpdateDto = {
        title: new PromptTitleValueObject('Updated Title'),
        description: new PromptDescriptionValueObject('Updated description'),
        content: new PromptContentValueObject('Updated content'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.title.value).toBe('Updated Title');
      expect(aggregate.description?.value).toBe('Updated description');
      expect(aggregate.content.value).toBe('Updated content');
      expect(aggregate.slug.value).toBe('test-prompt'); // Unchanged
    });

    it('should update only provided properties', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: IPromptUpdateDto = {
        title: new PromptTitleValueObject('Updated Title'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.title.value).toBe('Updated Title');
      expect(aggregate.slug.value).toBe('test-prompt'); // Unchanged
      expect(aggregate.version.value).toBe(1); // Unchanged
    });

    it('should emit PromptUpdatedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);
      const updateDto: IPromptUpdateDto = {
        title: new PromptTitleValueObject('Updated Title'),
      };

      aggregate.update(updateDto, true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptUpdatedEvent);
    });

    it('should update updatedAt timestamp', () => {
      const aggregate = createBaseAggregate(false);
      const beforeUpdate = aggregate.toPrimitives().updatedAt;
      const updateDto: IPromptUpdateDto = {
        title: new PromptTitleValueObject('Updated Title'),
      };

      // Wait a bit to ensure timestamp difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      aggregate.update(updateDto, false);
      const afterUpdate = aggregate.toPrimitives().updatedAt;

      expect(afterUpdate.getTime()).toBeGreaterThan(beforeUpdate.getTime());
      jest.useRealTimers();
    });
  });

  describe('delete', () => {
    it('should emit PromptDeletedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.delete(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptDeletedEvent);
    });

    it('should not emit event when generateEvent is false', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.delete(false);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(0);
    });
  });

  describe('activate', () => {
    it('should change status to ACTIVE', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.activate(false);

      expect(aggregate.status.value).toBe(PromptStatusEnum.ACTIVE);
    });

    it('should emit PromptActivatedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.activate(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptActivatedEvent);
    });
  });

  describe('draft', () => {
    it('should change status to DRAFT', () => {
      const aggregate = createBaseAggregate(false);
      aggregate.activate(false); // Change from DRAFT to ACTIVE first

      aggregate.draft(false);

      expect(aggregate.status.value).toBe(PromptStatusEnum.DRAFT);
    });

    it('should emit PromptDraftedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.draft(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptDraftedEvent);
    });
  });

  describe('archive', () => {
    it('should change status to ARCHIVED', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.archive(false);

      expect(aggregate.status.value).toBe(PromptStatusEnum.ARCHIVED);
    });

    it('should emit PromptArchivedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.archive(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptArchivedEvent);
    });
  });

  describe('deprecate', () => {
    it('should change status to DEPRECATED', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.deprecate(false);

      expect(aggregate.status.value).toBe(PromptStatusEnum.DEPRECATED);
    });

    it('should emit PromptDeprecatedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.deprecate(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptDeprecatedEvent);
    });
  });

  describe('incrementVersion', () => {
    it('should increment version by 1', () => {
      const aggregate = createBaseAggregate(false);
      const initialVersion = aggregate.version.value;

      aggregate.incrementVersion(false);

      expect(aggregate.version.value).toBe(initialVersion + 1);
    });

    it('should emit PromptVersionIncrementedEvent when generateEvent is true', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.incrementVersion(true);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PromptVersionIncrementedEvent);
    });

    it('should increment version multiple times', () => {
      const aggregate = createBaseAggregate(false);

      aggregate.incrementVersion(false);
      aggregate.incrementVersion(false);
      aggregate.incrementVersion(false);

      expect(aggregate.version.value).toBe(4);
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.id).toBeInstanceOf(PromptUuidValueObject);
      expect(aggregate.id.value).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should return correct slug', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.slug).toBeInstanceOf(PromptSlugValueObject);
      expect(aggregate.slug.value).toBe('test-prompt');
    });

    it('should return correct version', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.version).toBeInstanceOf(PromptVersionValueObject);
      expect(aggregate.version.value).toBe(1);
    });

    it('should return correct title', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.title).toBeInstanceOf(PromptTitleValueObject);
      expect(aggregate.title.value).toBe('Test Prompt');
    });

    it('should return correct description', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.description).toBeInstanceOf(
        PromptDescriptionValueObject,
      );
      expect(aggregate.description?.value).toBe('Test description');
    });

    it('should return correct content', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.content).toBeInstanceOf(PromptContentValueObject);
      expect(aggregate.content.value).toBe('Test content');
    });

    it('should return correct status', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.status).toBeInstanceOf(PromptStatusValueObject);
      expect(aggregate.status.value).toBe(PromptStatusEnum.DRAFT);
    });

    it('should return correct isActive', () => {
      const aggregate = createBaseAggregate(false);
      expect(aggregate.isActive).toBeInstanceOf(PromptIsActiveValueObject);
      expect(aggregate.isActive.value).toBe(true);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives', () => {
      const aggregate = createBaseAggregate(false);
      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should convert aggregate with null description to primitives', () => {
      const now = new Date();
      const dto: IPromptCreateDto = {
        id: new PromptUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        slug: new PromptSlugValueObject('test-prompt'),
        version: new PromptVersionValueObject(1),
        title: new PromptTitleValueObject('Test Prompt'),
        description: null,
        content: new PromptContentValueObject('Test content'),
        status: new PromptStatusValueObject(PromptStatusEnum.DRAFT),
        isActive: new PromptIsActiveValueObject(true),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = new PromptAggregate(dto, false);
      const primitives = aggregate.toPrimitives();

      expect(primitives.description).toBeNull();
    });
  });

  describe('commit', () => {
    it('should clear uncommitted events after commit', () => {
      const aggregate = createBaseAggregate(true);
      expect(aggregate.getUncommittedEvents()).toHaveLength(1);

      aggregate.commit();

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });
});
