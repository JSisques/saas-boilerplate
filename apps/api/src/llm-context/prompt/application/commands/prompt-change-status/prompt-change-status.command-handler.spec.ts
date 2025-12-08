import { PromptChangeStatusCommand } from '@/llm-context/prompt/application/commands/prompt-change-status/prompt-change-status.command';
import { PromptChangeStatusCommandHandler } from '@/llm-context/prompt/application/commands/prompt-change-status/prompt-change-status.command-handler';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { PromptActivatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-activated/prompt-activated.event';
import { PromptArchivedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-archived/prompt-activated.event';
import { PromptDeprecatedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-deprecated/prompt-deprecated.event';
import { PromptDraftedEvent } from '@/shared/domain/events/llm-context/prompts/prompt-drafted/prompt-drafted.event';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('PromptChangeStatusCommandHandler', () => {
  let handler: PromptChangeStatusCommandHandler;
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
        PromptChangeStatusCommandHandler,
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

    handler = module.get<PromptChangeStatusCommandHandler>(
      PromptChangeStatusCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should change status to ACTIVE and call activate', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptChangeStatusCommand({
        id: promptId,
        status: PromptStatusEnum.ACTIVE,
      });

      const mockAggregate = {
        id: { value: promptId },
        activate: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptActivatedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptActivatedEvent',
            },
            {
              id: promptId,
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
      expect(mockAggregate.activate).toHaveBeenCalledTimes(1);
      expect(mockPromptWriteRepository.save).toHaveBeenCalledWith(
        mockAggregate,
      );
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockAggregate.commit).toHaveBeenCalledTimes(1);
    });

    it('should change status to DRAFT and call draft', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptChangeStatusCommand({
        id: promptId,
        status: PromptStatusEnum.DRAFT,
      });

      const mockAggregate = {
        id: { value: promptId },
        draft: jest.fn(),
        activate: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptDraftedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptDraftedEvent',
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

      expect(mockAggregate.draft).toHaveBeenCalledTimes(1);
      expect(mockAggregate.activate).not.toHaveBeenCalled();
    });

    it('should change status to ARCHIVED and call archive', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptChangeStatusCommand({
        id: promptId,
        status: PromptStatusEnum.ARCHIVED,
      });

      const mockAggregate = {
        id: { value: promptId },
        archive: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptArchivedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptArchivedEvent',
            },
            {
              id: promptId,
              slug: 'test-prompt',
              version: 1,
              title: 'Test Prompt',
              description: 'Test description',
              content: 'Test content',
              status: PromptStatusEnum.ARCHIVED,
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

      expect(mockAggregate.archive).toHaveBeenCalledTimes(1);
    });

    it('should change status to DEPRECATED and call deprecate', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptChangeStatusCommand({
        id: promptId,
        status: PromptStatusEnum.DEPRECATED,
      });

      const mockAggregate = {
        id: { value: promptId },
        deprecate: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([
          new PromptDeprecatedEvent(
            {
              aggregateId: promptId,
              aggregateType: 'PromptAggregate',
              eventType: 'PromptDeprecatedEvent',
            },
            {
              id: promptId,
              slug: 'test-prompt',
              version: 1,
              title: 'Test Prompt',
              description: 'Test description',
              content: 'Test content',
              status: PromptStatusEnum.DEPRECATED,
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

      expect(mockAggregate.deprecate).toHaveBeenCalledTimes(1);
    });

    it('should handle all valid status values correctly', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      // Test that all valid statuses are handled correctly
      const validStatuses = [
        PromptStatusEnum.ACTIVE,
        PromptStatusEnum.DRAFT,
        PromptStatusEnum.ARCHIVED,
        PromptStatusEnum.DEPRECATED,
      ];

      for (const status of validStatuses) {
        const command = new PromptChangeStatusCommand({
          id: promptId,
          status,
        });

        const mockAggregate = {
          id: { value: promptId },
          activate: jest.fn(),
          draft: jest.fn(),
          archive: jest.fn(),
          deprecate: jest.fn(),
          getUncommittedEvents: jest.fn().mockReturnValue([]),
          commit: jest.fn(),
        } as unknown as PromptAggregate;

        mockAssertPromptExsistsService.execute.mockResolvedValue(mockAggregate);
        mockPromptWriteRepository.save.mockResolvedValue(undefined);
        mockEventBus.publishAll.mockResolvedValue(undefined);

        await handler.execute(command);

        // Verify the correct method was called based on status
        if (status === PromptStatusEnum.ACTIVE) {
          expect(mockAggregate.activate).toHaveBeenCalledTimes(1);
        } else if (status === PromptStatusEnum.DRAFT) {
          expect(mockAggregate.draft).toHaveBeenCalledTimes(1);
        } else if (status === PromptStatusEnum.ARCHIVED) {
          expect(mockAggregate.archive).toHaveBeenCalledTimes(1);
        } else if (status === PromptStatusEnum.DEPRECATED) {
          expect(mockAggregate.deprecate).toHaveBeenCalledTimes(1);
        }

        jest.clearAllMocks();
      }
    });

    it('should handle errors from assert service', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const command = new PromptChangeStatusCommand({
        id: promptId,
        status: PromptStatusEnum.ACTIVE,
      });

      const serviceError = new Error('Prompt not found');
      mockAssertPromptExsistsService.execute.mockRejectedValue(serviceError);

      await expect(handler.execute(command)).rejects.toThrow(serviceError);
      expect(mockPromptWriteRepository.save).not.toHaveBeenCalled();
    });
  });
});
