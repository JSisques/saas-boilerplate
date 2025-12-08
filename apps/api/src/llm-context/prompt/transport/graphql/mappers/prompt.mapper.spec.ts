import { PromptViewModel } from '@/llm-context/prompt/domain/view-models/prompt.view-model';
import { PromptGraphQLMapper } from '@/llm-context/prompt/transport/graphql/mappers/prompt.mapper';
import { PromptStatusEnum } from '@/llm-context/prompt/domain/enum/prompt-status.enum';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('PromptGraphQLMapper', () => {
  let mapper: PromptGraphQLMapper;

  beforeEach(() => {
    mapper = new PromptGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert prompt view model to response DTO with all properties', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
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
    });

    it('should convert prompt view model with different status', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModel = new PromptViewModel({
        id: promptId,
        slug: 'active-prompt',
        version: 2,
        title: 'Active Prompt',
        description: 'Active description',
        content: 'Active content',
        status: PromptStatusEnum.ACTIVE,
        isActive: true,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: promptId,
        slug: 'active-prompt',
        version: 2,
        title: 'Active Prompt',
        description: 'Active description',
        content: 'Active content',
        status: PromptStatusEnum.ACTIVE,
        isActive: true,
        createdAt,
        updatedAt,
      });
    });

    it('should convert prompt view model with null description', () => {
      const promptId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModel = new PromptViewModel({
        id: promptId,
        slug: 'no-description-prompt',
        version: 1,
        title: 'No Description Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: false,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: promptId,
        slug: 'no-description-prompt',
        version: 1,
        title: 'No Description Prompt',
        description: null,
        content: 'Test content',
        status: PromptStatusEnum.DRAFT,
        isActive: false,
        createdAt,
        updatedAt,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
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
        new PromptViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          slug: 'prompt-2',
          version: 2,
          title: 'Prompt 2',
          description: 'Description 2',
          content: 'Content 2',
          status: PromptStatusEnum.ACTIVE,
          isActive: true,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0]).toEqual({
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
      });
      expect(result.items[1]).toEqual({
        id: '223e4567-e89b-12d3-a456-426614174001',
        slug: 'prompt-2',
        version: 2,
        title: 'Prompt 2',
        description: 'Description 2',
        content: 'Content 2',
        status: PromptStatusEnum.ACTIVE,
        isActive: true,
        createdAt,
        updatedAt,
      });
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult<PromptViewModel>(
        [],
        0,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should convert paginated result with pagination metadata', () => {
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: PromptViewModel[] = Array.from(
        { length: 5 },
        (_, i) =>
          new PromptViewModel({
            id: `${i}e4567-e89b-12d3-a456-426614174000`,
            slug: `prompt-${i}`,
            version: i + 1,
            title: `Prompt ${i}`,
            description: `Description ${i}`,
            content: `Content ${i}`,
            status: PromptStatusEnum.DRAFT,
            isActive: true,
            createdAt,
            updatedAt,
          }),
      );

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 5);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
      expect(result.items[0].slug).toBe('prompt-0');
      expect(result.items[4].slug).toBe('prompt-4');
    });
  });
});
