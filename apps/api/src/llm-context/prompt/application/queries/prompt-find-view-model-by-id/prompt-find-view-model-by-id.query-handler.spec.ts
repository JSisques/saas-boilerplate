import { FindPromptViewModelByIdQueryHandler } from '@/llm-context/prompt/application/queries/prompt-find-view-model-by-id/prompt-find-view-model-by-id.query-handler';
import { FindPromptViewModelByIdQuery } from '@/llm-context/prompt/application/queries/prompt-find-view-model-by-id/prompt-find-view-model-by-id.query';
import { AssertPromptViewModelExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-view-model-exsits/assert-prompt-view-model-exsits.service';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { Test } from '@nestjs/testing';

describe('FindPromptViewModelByIdQueryHandler', () => {
  let handler: FindPromptViewModelByIdQueryHandler;
  let mockAssertPromptViewModelExsistsService: jest.Mocked<AssertPromptViewModelExsistsService>;

  beforeEach(async () => {
    mockAssertPromptViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPromptViewModelExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindPromptViewModelByIdQueryHandler,
        {
          provide: AssertPromptViewModelExsistsService,
          useValue: mockAssertPromptViewModelExsistsService,
        },
      ],
    }).compile();

    handler = module.get<FindPromptViewModelByIdQueryHandler>(
      FindPromptViewModelByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return prompt view model when found', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPromptViewModelByIdQuery({ id: promptId });

      const mockPromptViewModel = {
        id: promptId,
      } as PromptViewModel;

      mockAssertPromptViewModelExsistsService.execute.mockResolvedValue(
        mockPromptViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPromptViewModel);
      expect(
        mockAssertPromptViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(promptId);
      expect(
        mockAssertPromptViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw error when prompt view model does not exist', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPromptViewModelByIdQuery({ id: promptId });

      const error = new Error('Prompt not found');
      mockAssertPromptViewModelExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
    });
  });
});
