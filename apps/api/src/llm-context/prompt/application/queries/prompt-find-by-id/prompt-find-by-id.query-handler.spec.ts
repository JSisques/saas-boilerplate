import { FindPromptByIdQueryHandler } from '@/llm-context/prompt/application/queries/prompt-find-by-id/prompt-find-by-id.query-handler';
import { FindPromptByIdQuery } from '@/llm-context/prompt/application/queries/prompt-find-by-id/prompt-find-by-id.query';
import { AssertPromptExsistsService } from '@/llm-context/prompt/application/services/assert-prompt-exsits/assert-prompt-exsits.service';
import { PromptAggregate } from '@/llm-context/prompt/domain/aggregates/prompt.aggregate';
import { Test } from '@nestjs/testing';

describe('FindPromptByIdQueryHandler', () => {
  let handler: FindPromptByIdQueryHandler;
  let mockAssertPromptExsistsService: jest.Mocked<AssertPromptExsistsService>;

  beforeEach(async () => {
    mockAssertPromptExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPromptExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindPromptByIdQueryHandler,
        {
          provide: AssertPromptExsistsService,
          useValue: mockAssertPromptExsistsService,
        },
      ],
    }).compile();

    handler = module.get<FindPromptByIdQueryHandler>(
      FindPromptByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return prompt aggregate when found', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPromptByIdQuery({ id: promptId });

      const mockPrompt = {
        id: { value: promptId },
      } as PromptAggregate;

      mockAssertPromptExsistsService.execute.mockResolvedValue(mockPrompt);

      const result = await handler.execute(query);

      expect(result).toBe(mockPrompt);
      expect(mockAssertPromptExsistsService.execute).toHaveBeenCalledWith(
        promptId,
      );
      expect(mockAssertPromptExsistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw error when prompt does not exist', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPromptByIdQuery({ id: promptId });

      const error = new Error('Prompt not found');
      mockAssertPromptExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
    });
  });
});
