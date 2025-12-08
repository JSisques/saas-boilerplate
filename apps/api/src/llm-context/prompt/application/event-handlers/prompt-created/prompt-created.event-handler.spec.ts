import { PromptCreatedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-created/prompt-created.event-handler';
import { PromptViewModelFactory } from '@/llm-context/prompt/domain/factories/prompt-plan-view-model/prompt-view-model.factory';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptCreatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-created/prompt-created.event';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { Test } from '@nestjs/testing';

describe('PromptCreatedEventHandler', () => {
  let handler: PromptCreatedEventHandler;
  let mockPromptReadRepository: jest.Mocked<PromptReadRepository>;
  let mockPromptViewModelFactory: jest.Mocked<PromptViewModelFactory>;

  beforeEach(async () => {
    mockPromptReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PromptReadRepository>;

    mockPromptViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<PromptViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        PromptCreatedEventHandler,
        {
          provide: PROMPT_READ_REPOSITORY_TOKEN,
          useValue: mockPromptReadRepository,
        },
        {
          provide: PromptViewModelFactory,
          useValue: mockPromptViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<PromptCreatedEventHandler>(PromptCreatedEventHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save prompt view model from event data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
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

      const event = new PromptCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'PromptAggregate',
          eventType: 'PromptCreatedEvent',
        },
        eventData,
      );

      const viewModel = new PromptViewModel(eventData);

      mockPromptViewModelFactory.fromPrimitives.mockReturnValue(viewModel);
      mockPromptReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockPromptViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        eventData,
      );
      expect(mockPromptViewModelFactory.fromPrimitives).toHaveBeenCalledTimes(
        1,
      );
      expect(mockPromptReadRepository.save).toHaveBeenCalledWith(viewModel);
      expect(mockPromptReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should handle event with different status values', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const statuses = [
        PromptStatusEnum.ACTIVE,
        PromptStatusEnum.DRAFT,
        PromptStatusEnum.ARCHIVED,
        PromptStatusEnum.DEPRECATED,
      ];

      for (const status of statuses) {
        const eventData = {
          id: aggregateId,
          slug: 'test-prompt',
          version: 1,
          title: 'Test Prompt',
          description: 'Test description',
          content: 'Test content',
          status: status,
          isActive: true,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        };

        const event = new PromptCreatedEvent(
          {
            aggregateId: aggregateId,
            aggregateType: 'PromptAggregate',
            eventType: 'PromptCreatedEvent',
          },
          eventData,
        );

        const viewModel = new PromptViewModel(eventData);

        mockPromptViewModelFactory.fromPrimitives.mockReturnValue(viewModel);
        mockPromptReadRepository.save.mockResolvedValue(undefined);

        await handler.handle(event);

        expect(mockPromptViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
          eventData,
        );
        expect(mockPromptReadRepository.save).toHaveBeenCalledWith(viewModel);
      }

      expect(mockPromptReadRepository.save).toHaveBeenCalledTimes(
        statuses.length,
      );
    });
  });
});
