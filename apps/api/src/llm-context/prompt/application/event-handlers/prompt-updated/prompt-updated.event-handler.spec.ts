import { PromptUpdatedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-updated/prompt-updated.event-handler';
import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptUpdatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-updated/prompt-updated.event';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { Test } from '@nestjs/testing';

describe('PromptUpdatedEventHandler', () => {
  let handler: PromptUpdatedEventHandler;
  let mockPromptReadRepository: jest.Mocked<PromptReadRepository>;
  let mockAssertPromptViewModelExsistsService: jest.Mocked<AssertPromptViewModelExsistsService>;

  beforeEach(async () => {
    mockPromptReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PromptReadRepository>;

    mockAssertPromptViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPromptViewModelExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        PromptUpdatedEventHandler,
        {
          provide: PROMPT_READ_REPOSITORY_TOKEN,
          useValue: mockPromptReadRepository,
        },
        {
          provide: AssertPromptViewModelExsistsService,
          useValue: mockAssertPromptViewModelExsistsService,
        },
      ],
    }).compile();

    handler = module.get<PromptUpdatedEventHandler>(PromptUpdatedEventHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save prompt view model from event data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        title: 'Updated Title',
        description: 'Updated description',
        content: 'Updated content',
      };

      const event = new PromptUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'PromptAggregate',
          eventType: 'PromptUpdatedEvent',
        },
        eventData,
      );

      const viewModel = new PromptViewModel({
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
      });

      const updateSpy = jest.spyOn(viewModel, 'update');

      mockAssertPromptViewModelExsistsService.execute.mockResolvedValue(
        viewModel,
      );
      mockPromptReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertPromptViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(updateSpy).toHaveBeenCalledWith(eventData);
      expect(mockPromptReadRepository.save).toHaveBeenCalledWith(viewModel);
      expect(mockPromptReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });

    it('should handle errors from assert service', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        title: 'Updated Title',
      };

      const event = new PromptUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'PromptAggregate',
          eventType: 'PromptUpdatedEvent',
        },
        eventData,
      );

      const serviceError = new Error('Prompt view model not found');
      mockAssertPromptViewModelExsistsService.execute.mockRejectedValue(
        serviceError,
      );

      await expect(handler.handle(event)).rejects.toThrow(serviceError);
      expect(mockPromptReadRepository.save).not.toHaveBeenCalled();
    });
  });
});
