import { PromptCreateCommandHandler } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command-handler';
import { PromptCreateCommand } from '@/llm-context/prompt/application/commands/prompt-create/prompt-create.command';
import { PromptAggregateFactory } from '@/llm-context/prompt/domain/factories/prompt-aggregate/prompt-aggregate.factory';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PromptContentValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-content/prompt-content.vo';
import { PromptDescriptionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-description/prompt-description.vo';
import { PromptIsActiveValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-is-active/prompt-is-active.vo';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptStatusValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-status/prompt-status.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptVersionValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-version/prompt-version.vo';
import { PromptCreatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-created/prompt-created.event';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('PromptCreateCommandHandler', () => {
  let handler: PromptCreateCommandHandler;
  let mockPromptWriteRepository: jest.Mocked<PromptWriteRepository>;
  let mockPromptAggregateFactory: jest.Mocked<PromptAggregateFactory>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    mockPromptWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PromptWriteRepository>;

    mockPromptAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<PromptAggregateFactory>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    const module = await Test.createTestingModule({
      providers: [
        PromptCreateCommandHandler,
        {
          provide: PROMPT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPromptWriteRepository,
        },
        {
          provide: PromptAggregateFactory,
          useValue: mockPromptAggregateFactory,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<PromptCreateCommandHandler>(
      PromptCreateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create and save a prompt aggregate', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptCreateCommand({
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
      });

      const mockAggregate = {
        id: { value: promptId },
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptCreatedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptCreatedEvent',
            },
            {
              id: promptId,
              slug: 'test-prompt',
              version: 1,
              title: 'Test Prompt',
              description: 'Test description',
              content: 'Test content',
              status: PromptStatusEnum.DRAFT,
              isActive: true,
              createdAt: new Date('2024-01-01T10:00:00Z'),
              updatedAt: new Date('2024-01-01T10:00:00Z'),
            },
          ),
        ]),
        commit: jest.fn(),
      } as unknown as PromptAggregate;

      mockPromptAggregateFactory.create.mockReturnValue(mockAggregate);
      mockPromptWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      const result = await handler.execute(command);

      expect(result).toBe(promptId);
      expect(mockPromptAggregateFactory.create).toHaveBeenCalledTimes(1);
      expect(mockPromptWriteRepository.save).toHaveBeenCalledWith(
        mockAggregate,
      );
      expect(mockPromptWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockAggregate.commit).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from repository', async () => {
      const command = new PromptCreateCommand({
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
      });

      const mockAggregate = {
        id: { value: '123e4567-e89b-12d3-a456-426614174000' },
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as PromptAggregate;

      mockPromptAggregateFactory.create.mockReturnValue(mockAggregate);
      const repositoryError = new Error('Database error');
      mockPromptWriteRepository.save.mockRejectedValue(repositoryError);

      await expect(handler.execute(command)).rejects.toThrow(repositoryError);
      expect(mockPromptWriteRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).not.toHaveBeenCalled();
    });
  });
});
