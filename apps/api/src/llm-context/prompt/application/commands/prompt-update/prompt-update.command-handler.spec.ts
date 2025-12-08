import { PromptUpdateCommand } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command';
import { PromptUpdateCommandHandler } from '@/llm-context/prompt/application/commands/prompt-update/prompt-update.command-handler';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptSlugValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-slug/prompt-slug.vo';
import { PromptTitleValueObject } from '@/llm-context/prompt/domain/value-objects/prompt-title/prompt-title.vo';
import { PromptUpdatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-updated/prompt-updated.event';
import { PromptVersionIncrementedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-version-incremented/prompt-version-incremented.event';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('PromptUpdateCommandHandler', () => {
  let handler: PromptUpdateCommandHandler;
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
        PromptUpdateCommandHandler,
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

    handler = module.get<PromptUpdateCommandHandler>(
      PromptUpdateCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update prompt with provided fields', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptUpdateCommand({
        id: promptId,
        title: 'Updated Title',
        description: 'Updated description',
        content: 'Updated content',
      });

      const mockAggregate = {
        id: { value: promptId },
        update: jest.fn(),
        incrementVersion: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptUpdatedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptUpdatedEvent',
            },
            {},
          ),
          new PromptVersionIncrementedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptVersionIncrementedEvent',
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
      mockPromptWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAssertPromptExsistsService.execute).toHaveBeenCalledWith(
        promptId,
      );
      expect(mockAggregate.update).toHaveBeenCalledTimes(1);
      expect(mockAggregate.incrementVersion).toHaveBeenCalledTimes(1);
      expect(mockPromptWriteRepository.save).toHaveBeenCalledWith(
        mockAggregate,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockAggregate.commit).toHaveBeenCalledTimes(1);
    });

    it('should update only provided fields', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptUpdateCommand({
        id: promptId,
        title: 'Updated Title',
      });

      const mockAggregate = {
        id: { value: promptId },
        update: jest.fn(),
        incrementVersion: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as PromptAggregate;

      mockAssertPromptExsistsService.execute.mockResolvedValue(mockAggregate);
      mockPromptWriteRepository.save.mockResolvedValue(undefined);
      mockEventBus.publishAll.mockResolvedValue(undefined);

      await handler.execute(command);

      expect(mockAggregate.update).toHaveBeenCalledTimes(1);
      const updateCall = (mockAggregate.update as jest.Mock).mock.calls[0][0];
      expect(updateCall.title).toBeInstanceOf(PromptTitleValueObject);
      expect(updateCall.slug).toBeInstanceOf(PromptSlugValueObject);
      expect(updateCall.description).toBeUndefined();
      expect(updateCall.content).toBeUndefined();
    });

    it('should handle errors from assert service', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptUpdateCommand({
        id: promptId,
        title: 'Updated Title',
      });

      const serviceError = new Error('Prompt not found');
      mockAssertPromptExsistsService.execute.mockRejectedValue(serviceError);

      await expect(handler.execute(command)).rejects.toThrow(serviceError);
      expect(mockPromptWriteRepository.save).not.toHaveBeenCalled();
    });
  });
});
