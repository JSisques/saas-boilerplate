import { FindPromptsByCriteriaQuery } from '@/llm-context/prompt/application/queries/prompt-find-by-criteria/prompt-find-by-criteria.query';
import { FindPromptsByCriteriaQueryHandler } from '@/llm-context/prompt/application/queries/prompt-find-by-criteria/prompt-find-by-criteria.query-handler';
import {
  PROMPT_READ_REPOSITORY_TOKEN,
  PromptReadRepository,
} from '@/llm-context/prompt/domain/repositories/prompt-read/prompt-read.repository';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { Test } from '@nestjs/testing';

describe('FindPromptsByCriteriaQueryHandler', () => {
  let handler: FindPromptsByCriteriaQueryHandler;
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
        FindPromptsByCriteriaQueryHandler,
        {
          provide: PROMPT_READ_REPOSITORY_TOKEN,
          useValue: mockPromptReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindPromptsByCriteriaQueryHandler>(
      FindPromptsByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result of prompts', async () => {
      const criteria = new Criteria(
        [],
        [{ field: 'createdAt', direction: SortDirection.DESC }],
        { page: 1, perPage: 10 },
      );
      const query = new FindPromptsByCriteriaQuery({ criteria });

      const mockPrompts = [
        { id: '1' } as PromptViewModel,
        { id: '2' } as PromptViewModel,
      ];
      const paginatedResult = new PaginatedResult<PromptViewModel>(
        mockPrompts,
        2,
        1,
        10,
      );

      mockPromptReadRepository.findByCriteria.mockResolvedValue(
        paginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(paginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockPromptReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockPromptReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no prompts found', async () => {
      const criteria = new Criteria(
        [],
        [{ field: 'createdAt', direction: SortDirection.DESC }],
        { page: 1, perPage: 10 },
      );
      const query = new FindPromptsByCriteriaQuery({ criteria });

      const paginatedResult = new PaginatedResult<PromptViewModel>(
        [],
        0,
        1,
        10,
      );

      mockPromptReadRepository.findByCriteria.mockResolvedValue(
        paginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(paginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
