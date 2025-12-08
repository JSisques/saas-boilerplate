import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { IPromptCreateDto } from '@/llm-context/prompt/domain/dtos/entities/prompt-create/prompt-create.dto';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import { PromptPrimitives } from '@/llm-context/prompt/domain/primitives/prompt.primitives';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { PromptCreatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-created/prompt-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

describe('PromptAggregateFactory', () => {
  let factory: PromptAggregateFactory;

  beforeEach(() => {
    factory = new PromptAggregateFactory();
  });

  describe('create', () => {
    it('should create a PromptAggregate from DTO with all fields and generate event by default', () => {
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

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(PromptAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.slug.value).toBe(dto.slug.value);
      expect(aggregate.version.value).toBe(dto.version.value);
      expect(aggregate.title.value).toBe(dto.title.value);
      expect(aggregate.description?.value).toBe(dto.description?.value);
      expect(aggregate.content.value).toBe(dto.content.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.isActive.value).toBe(dto.isActive.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(PromptCreatedEvent);
    });

    it('should create a PromptAggregate from DTO without generating event when generateEvent is false', () => {
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

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(PromptAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a PromptAggregate from primitives with all fields', () => {
      const now = new Date();
      const primitives: PromptPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(PromptAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.slug.value).toBe(primitives.slug);
      expect(aggregate.version.value).toBe(primitives.version);
      expect(aggregate.title.value).toBe(primitives.title);
      expect(aggregate.description?.value).toBe(primitives.description);
      expect(aggregate.content.value).toBe(primitives.content);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.isActive.value).toBe(primitives.isActive);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a PromptAggregate from primitives with null description', () => {
      const now = new Date();
      const primitives: PromptPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(PromptAggregate);
      expect(aggregate.description).toBeNull();
    });

    it('should create a PromptAggregate from primitives without generating event by default', () => {
      const now = new Date();
      const primitives: PromptPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      // Check that no event was generated by default
      // fromPrimitives is used to recreate aggregates from DB, which should not generate new events
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a PromptAggregate from primitives with different status values', () => {
      const now = new Date();
      const statuses = [
        PromptStatusEnum.ACTIVE,
        PromptStatusEnum.DRAFT,
        PromptStatusEnum.ARCHIVED,
        PromptStatusEnum.DEPRECATED,
      ];

      statuses.forEach((status) => {
        const primitives: PromptPrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          slug: 'test-prompt',
          version: 1,
          title: 'Test Prompt',
          description: 'Test description',
          content: 'Test content',
          status: status,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };

        const aggregate = factory.fromPrimitives(primitives);

        expect(aggregate.status.value).toBe(status);
      });
    });
  });
});
