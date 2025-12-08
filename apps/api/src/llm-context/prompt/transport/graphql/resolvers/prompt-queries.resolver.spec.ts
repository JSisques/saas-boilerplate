import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { FindPromptsByCriteriaQuery } from '@/llm-context/prompt/application/queries/prompt-find-by-criteria/prompt-find-by-criteria.query';
import { FindPromptViewModelByIdQuery } from '@/llm-context/prompt/application/queries/prompt-find-view-model-by-id/prompt-find-view-model-by-id.query';
import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptFindByCriteriaRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-find-by-criteria.request.dto';
import { PromptFindByIdRequestDto } from '@/llm-context/prompt/transport/graphql/dtos/requests/prompt-find-by-id.request.dto';
import { PromptGraphQLMapper } from '@/llm-context/prompt/transport/graphql/mappers/prompt.mapper';
import { PromptQueryResolver } from '@/llm-context/prompt/transport/graphql/resolvers/prompt-queries.resolver';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { QueryBus } from '@nestjs/cqrs';

describe('PromptQueryResolver', () => {
  let resolver: PromptQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockPromptGraphQLMapper: jest.Mocked<PromptGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockPromptGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<PromptGraphQLMapper>;

    resolver = new PromptQueryResolver(mockQueryBus, mockPromptGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('promptFindById', () => {
    it('should execute query bus and map result to response DTO', async () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PromptFindByIdRequestDto = {
        id: promptId,
      };

      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModel = new PromptViewModel({
        id: promptId,
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt,
        updatedAt,
      });

      const responseDto = {
        id: promptId,
        slug: 'test-prompt',
        version: 1,
        title: 'Test Prompt',
        description: 'Test description',
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: true,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockPromptGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.promptFindById(input);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPromptViewModelByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindPromptViewModelByIdQuery);
      expect(query.id.value).toBe(promptId);
      expect(mockPromptGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
      expect(result).toBe(responseDto);
    });
  });

  describe('promptFindByCriteria', () => {
    it('should execute query bus with criteria and map result to paginated response DTO', async () => {
      const input: PromptFindByCriteriaRequestDto = {
        filters: [],
        sorts: [{ field: 'createdAt', direction: SortDirection.DESC }],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: PromptViewModel[] = [
        new PromptViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          slug: 'prompt-1',
          version: 1,
          title: 'Prompt 1',
          description: 'Description 1',
          content: 'Content 1',
          status: PromptStatusEnum.DRAFT,
          isActive: true,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);

      const paginatedResponseDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            slug: 'prompt-1',
            version: 1,
            title: 'Prompt 1',
            description: 'Description 1',
            content: 'Content 1',
            status: PromptStatusEnum.DRAFT,
            isActive: true,
            createdAt,
            updatedAt,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockPromptGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.promptFindByCriteria(input);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPromptsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindPromptsByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockPromptGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
      expect(result).toBe(paginatedResponseDto);
    });

    it('should handle null input and create default criteria', async () => {
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: PromptViewModel[] = [];

      const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);

      const paginatedResponseDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockPromptGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.promptFindByCriteria(undefined);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPromptsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(result).toBe(paginatedResponseDto);
    });
  });
});
