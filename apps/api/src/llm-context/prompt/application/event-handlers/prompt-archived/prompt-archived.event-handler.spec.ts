import { PromptArchivedEventHandler } from '@/llm-context/prompt/application/event-handlers/prompt-archived/prompt-archived.event-handler';
import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptArchivedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-archived/prompt-activated.event';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { Test } from '@nestjs/testing';

describe('PromptArchivedEventHandler', () => {
  let handler: PromptArchivedEventHandler;
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
        PromptArchivedEventHandler,
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

    handler = module.get<PromptArchivedEventHandler>(
      PromptArchivedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update prompt view model status to ARCHIVED', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const event = new PromptArchivedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'PromptAggregate',
          eventType: 'PromptArchivedEvent',
        },
        {
          id: aggregateId,
          slug: 'test-prompt',
          version: 1,
          title: 'Test Prompt',
          description: 'Test description',
          content: 'Test content',
          status: PromptStatusEnum.ACTIVE,
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
        status: PromptStatusEnum.ACTIVE,
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
      expect(updateSpy).toHaveBeenCalledWith({
        status: PromptStatusEnum.ARCHIVED,
      });
      expect(mockPromptReadRepository.save).toHaveBeenCalledWith(viewModel);

      updateSpy.mockRestore();
    });
  });
});
