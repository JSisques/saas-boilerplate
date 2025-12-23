import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { PromptTypeormEntity } from '@/llm-context/prompt/infrastructure/database/typeorm/entities/prompt-typeorm.entity';
import { PromptTypeormMapper } from '@/llm-context/prompt/infrastructure/database/typeorm/mappers/prompt-typeorm.mapper';

describe('PromptTypeormMapper', () => {
  let mapper: PromptTypeormMapper;
  let mockPromptAggregateFactory: jest.Mocked<PromptAggregateFactory>;

  beforeEach(() => {
    mockPromptAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<PromptAggregateFactory>;

    mapper = new PromptTypeormMapper(mockPromptAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new PromptTypeormEntity();
      typeormEntity.id = promptId;
      typeormEntity.slug = 'test-prompt';
      typeormEntity.version = 1;
      typeormEntity.title = 'Test Prompt';
      typeormEntity.description = 'Test description';
      typeormEntity.content = 'Test content';
      typeormEntity.status = PromptStatusEnum.ACTIVE;
      typeormEntity.isActive = true;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockPromptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: new PromptDescriptionValueObject('Test description'),
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.ACTIVE),
          isActive: new PromptIsActiveValueObject(true),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPromptAggregateFactory.fromPrimitives.mockReturnValue(
        mockPromptAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockPromptAggregate);
      expect(mockPromptAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: promptId,
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.ACTIVE,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      expect(mockPromptAggregateFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should convert TypeORM entity with null optional properties', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new PromptTypeormEntity();
      typeormEntity.id = promptId;
      typeormEntity.slug = 'test-prompt';
      typeormEntity.version = 1;
      typeormEntity.title = 'Test Prompt';
      typeormEntity.description = null;
      typeormEntity.content = 'Test content';
      typeormEntity.status = PromptStatusEnum.DRAFT;
      typeormEntity.isActive = false;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockPromptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: null,
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.DRAFT),
          isActive: new PromptIsActiveValueObject(false),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPromptAggregateFactory.fromPrimitives.mockReturnValue(
        mockPromptAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockPromptAggregate);
      expect(mockPromptAggregateFactory.fromPrimitives).toHaveBeenCalledWith({
        id: promptId,
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: false,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockPromptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: new PromptDescriptionValueObject('Test description'),
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.ACTIVE),
          isActive: new PromptIsActiveValueObject(true),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockPromptAggregate, 'toPrimitives')
        .mockReturnValue({
          id: promptId,
          slug: 'test-prompt',
          version: 1,
          title: 'Test Prompt',
          description: 'Test description',
          content: 'Test content',
          status: PromptStatusEnum.ACTIVE,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockPromptAggregate);

      expect(result).toBeInstanceOf(PromptTypeormEntity);
      expect(result.id).toBe(promptId);
      expect(result.slug).toBe('test-prompt');
      expect(result.version).toBe(1);
      expect(result.title).toBe('Test Prompt');
      expect(result.description).toBe('Test description');
      expect(result.content).toBe('Test content');
      expect(result.status).toBe(PromptStatusEnum.ACTIVE);
      expect(result.isActive).toBe(true);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });

    it('should convert domain entity with null optional properties', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockPromptAggregate = new PromptAggregate(
        {
          id: new PromptUuidValueObject(promptId),
          slug: new PromptSlugValueObject('test-prompt'),
          version: new PromptVersionValueObject(1),
          title: new PromptTitleValueObject('Test Prompt'),
          description: null,
          content: new PromptContentValueObject('Test content'),
          status: new PromptStatusValueObject(PromptStatusEnum.DRAFT),
          isActive: new PromptIsActiveValueObject(false),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockPromptAggregate, 'toPrimitives')
        .mockReturnValue({
          id: promptId,
          slug: 'test-prompt',
          version: 1,
          title: 'Test Prompt',
          description: null,
          content: 'Test content',
          status: PromptStatusEnum.DRAFT,
          isActive: false,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockPromptAggregate);

      expect(result).toBeInstanceOf(PromptTypeormEntity);
      expect(result.id).toBe(promptId);
      expect(result.slug).toBe('test-prompt');
      expect(result.version).toBe(1);
      expect(result.title).toBe('Test Prompt');
      expect(result.description).toBeNull();
      expect(result.content).toBe('Test content');
      expect(result.status).toBe(PromptStatusEnum.DRAFT);
      expect(result.isActive).toBe(false);
      expect(result.deletedAt).toBeNull();

      toPrimitivesSpy.mockRestore();
    });
  });
});
