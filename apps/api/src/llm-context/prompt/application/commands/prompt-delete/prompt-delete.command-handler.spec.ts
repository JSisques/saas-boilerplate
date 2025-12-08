import { PromptDeleteCommand } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command';
import { PromptDeleteCommandHandler } from '@/llm-context/prompt/application/commands/prompt-delete/prompt-delete.command-handler';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptDeletedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deleted/prompt-deleted.event';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('PromptDeleteCommandHandler', () => {
  let handler: PromptDeleteCommandHandler;
  let mockPromptWriteRepository: jest.Mocked<PromptWriteRepository>;
  let mockAssertPromptExsistsService: jest.Mocked<AssertPromptExsistsService>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    mockPromptWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PromptWriteRepository>;

    mockAssertPromptExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPromptExsistsService>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    const module = await Test.createTestingModule({
      providers: [
        PromptDeleteCommandHandler,
        {
          provide: PROMPT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPromptWriteRepository,
        },
        {
          provide: AssertPromptExsistsService,
          useValue: mockAssertPromptExsistsService,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<PromptDeleteCommandHandler>(
      PromptDeleteCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete prompt and publish event', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptDeleteCommand({ id: promptId });

      const mockAggregate = {
        id: { value: promptId },
        delete: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptDeletedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptDeletedEvent',
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

      mockAssertPromptExsistsService.execute.mockResolvedValue(mockAggregate);
      mockPromptWriteRepository.delete.mockResolvedValue(true);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertPromptExsistsService.execute).toHaveBeenCalledWith(
        promptId,
      );
      expect(mockAggregate.delete).toHaveBeenCalledTimes(1);
      expect(mockPromptWriteRepository.delete).toHaveBeenCalledWith(promptId);
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockAggregate.commit).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from assert service', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptDeleteCommand({ id: promptId });

      const serviceError = new Error('Prompt not found');
      mockAssertPromptExsistsService.execute.mockRejectedValue(serviceError);

      await expect(handler.execute(command)).rejects.toThrow(serviceError);
      expect(mockPromptWriteRepository.delete).not.toHaveBeenCalled();
    });
  });
});
