import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptViewModelFactory } from '@/llm-context/prompt/domain/factories/prompt-plan-view-model/prompt-view-model.factory';
import { IPromptCreateViewModelDto } from '@/llm-context/prompt/domain/dtos/view-models/prompt-create-view-model/prompt-create-view-model.dto';
import { PromptPrimitives } from '@/llm-context/prompt/domain/primitives/prompt.primitives';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { PromptUuidValueObject } from '@/shared/domain/value-objects/identifiers/prompt-uuid/prompt-uuid.vo';

describe('PromptViewModelFactory', () => {
  let factory: PromptViewModelFactory;

  beforeEach(() => {
    factory = new PromptViewModelFactory();
  });

  describe('create', () => {
    it('should create a PromptViewModel from DTO with all fields', () => {
      const dto: IPromptCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(PromptViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.slug).toBe(dto.slug);
      expect(viewModel.version).toBe(dto.version);
      expect(viewModel.title).toBe(dto.title);
      expect(viewModel.description).toBe(dto.description);
      expect(viewModel.content).toBe(dto.content);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.isActive).toBe(dto.isActive);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a PromptViewModel from DTO with null description', () => {
      const dto: IPromptCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(PromptViewModel);
      expect(viewModel.description).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a PromptViewModel from primitives with all fields', () => {
      const primitives: PromptPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(PromptViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.slug).toBe(primitives.slug);
      expect(viewModel.version).toBe(primitives.version);
      expect(viewModel.title).toBe(primitives.title);
      expect(viewModel.description).toBe(primitives.description);
      expect(viewModel.content).toBe(primitives.content);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.isActive).toBe(primitives.isActive);
      expect(viewModel.createdAt).toEqual(primitives.createdAt);
      expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
    });

    it('should create a PromptViewModel from primitives with null description', () => {
      const primitives: PromptPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(PromptViewModel);
      expect(viewModel.description).toBeNull();
    });
  });

  describe('fromAggregate', () => {
    it('should create a PromptViewModel from aggregate with all fields', () => {
      const now = new Date();
      const aggregate = new PromptAggregate(
        {
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
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(PromptViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.slug).toBe(aggregate.slug.value);
      expect(viewModel.version).toBe(aggregate.version.value);
      expect(viewModel.title).toBe(aggregate.title.value);
      expect(viewModel.description).toBe(aggregate.description?.value);
      expect(viewModel.content).toBe(aggregate.content.value);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.isActive).toBe(aggregate.isActive.value);
      expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
    });

    it('should create a PromptViewModel from aggregate with null description', () => {
      const now = new Date();
      const aggregate = new PromptAggregate(
        {
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
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(PromptViewModel);
      expect(viewModel.description).toBeNull();
    });
  });
});
