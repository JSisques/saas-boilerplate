import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptNotFoundException } from '@/llm-context/prompt/application/exceptions/prompt-not-found/prompt-not-found.exception';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { Test } from '@nestjs/testing';

describe('AssertPromptViewModelExsistsService', () => {
  let service: AssertPromptViewModelExsistsService;
  let mockPromptReadRepository: jest.Mocked<PromptReadRepository>;

  beforeEach(async () => {
    mockPromptReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PromptReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertPromptViewModelExsistsService,
        {
          provide: PROMPT_READ_REPOSITORY_TOKEN,
          useValue: mockPromptReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertPromptViewModelExsistsService>(
      AssertPromptViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return prompt view model when prompt exists', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPromptViewModel = {
        id: promptId,
      } as PromptViewModel;

      mockPromptReadRepository.findById.mockResolvedValue(mockPromptViewModel);

      const result = await service.execute(promptId);

      expect(result).toBe(mockPromptViewModel);
      expect(mockPromptReadRepository.findById).toHaveBeenCalledWith(promptId);
      expect(mockPromptReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PromptNotFoundException when prompt does not exist', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockPromptReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(promptId)).rejects.toThrow(
        PromptNotFoundException,
      );
      expect(mockPromptReadRepository.findById).toHaveBeenCalledWith(promptId);
      expect(mockPromptReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PromptNotFoundException with correct message', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';

      mockPromptReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(promptId)).rejects.toThrow(
        `Prompt with id ${promptId} not found`,
      );
    });

    it('should propagate errors from repository', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockPromptReadRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(promptId)).rejects.toThrow(repositoryError);
    });
  });
});
