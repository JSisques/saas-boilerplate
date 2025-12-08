import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptNotFoundException } from '@/llm-context/prompt/application/exceptions/prompt-not-found/prompt-not-found.exception';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import {
  PROMPT_WRITE_REPOSITORY_TOKEN,
  PromptWriteRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-write/prompt-write.repository';
import { Test } from '@nestjs/testing';

describe('AssertPromptExsistsService', () => {
  let service: AssertPromptExsistsService;
  let mockPromptWriteRepository: jest.Mocked<PromptWriteRepository>;

  beforeEach(async () => {
    mockPromptWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PromptWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertPromptExsistsService,
        {
          provide: PROMPT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPromptWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertPromptExsistsService>(
      AssertPromptExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return prompt aggregate when prompt exists', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPrompt = {
        id: { value: promptId },
      } as PromptAggregate;

      mockPromptWriteRepository.findById.mockResolvedValue(mockPrompt);

      const result = await service.execute(promptId);

      expect(result).toBe(mockPrompt);
      expect(mockPromptWriteRepository.findById).toHaveBeenCalledWith(promptId);
      expect(mockPromptWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PromptNotFoundException when prompt does not exist', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockPromptWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(promptId)).rejects.toThrow(
        PromptNotFoundException,
      );
      expect(mockPromptWriteRepository.findById).toHaveBeenCalledWith(promptId);
      expect(mockPromptWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PromptNotFoundException with correct message', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockPromptWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(promptId)).rejects.toThrow(
        `Prompt with id ${promptId} not found`,
      );
    });

    it('should propagate errors from repository', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockPromptWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(promptId)).rejects.toThrow(repositoryError);
    });
  });
});
