import { PromptDeletedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-deleted/prompt-deleted.event-handler';
import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptDeletedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deleted/prompt-deleted.event';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { Test } from '@nestjs/testing';

describe('PromptDeletedEventHandler', () => {
  let handler: PromptDeletedEventHandler;
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
        PromptDeletedEventHandler,
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

    handler = module.get<PromptDeletedEventHandler>(PromptDeletedEventHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete prompt view model from repository', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PromptDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'PromptAggregate',
          eventType: 'PromptDeletedEvent',
        },
        {
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
        },
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

      mockAssertPromptViewModelExsistsService.execute.mockResolvedValue(
        viewModel,
      );
      mockPromptReadRepository.delete.mockResolvedValue(true);

      await handler.handle(event);

      expect(
        mockAssertPromptViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(aggregateId);
      expect(mockPromptReadRepository.delete).toHaveBeenCalledWith(aggregateId);
      expect(mockPromptReadRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from assert service', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PromptDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'PromptAggregate',
          eventType: 'PromptDeletedEvent',
        },
        {
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
        },
      );

      const serviceError = new Error('Prompt view model not found');
      mockAssertPromptViewModelExsistsService.execute.mockRejectedValue(
        serviceError,
      );

      await expect(handler.handle(event)).rejects.toThrow(serviceError);
      expect(mockPromptReadRepository.delete).not.toHaveBeenCalled();
    });
  });
});
