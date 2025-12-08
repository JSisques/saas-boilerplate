import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { StorageFindByCriteriaQuery } from '@/storage-context/storage/application/queries/storage-find-by-criteria/storage-find-by-criteria.query';
import { StorageFindByIdQuery } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query';
import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageFindByCriteriaRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-find-by-criteria.request.dto';
import { StorageFindByIdRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-find-by-id.request.dto';
import { PaginatedStorageResultDto } from '@/storage-context/storage/transport/graphql/dtos/responses/storage.response.dto';
import { StorageGraphQLMapper } from '@/storage-context/storage/transport/graphql/mappers/storage.mapper';
import { StorageQueryResolver } from '@/storage-context/storage/transport/graphql/resolvers/storage-queries.resolver';
import { QueryBus } from '@nestjs/cqrs';

describe('StorageQueryResolver', () => {
  let resolver: StorageQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockStorageGraphQLMapper: jest.Mocked<StorageGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockStorageGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<StorageGraphQLMapper>;

    resolver = new StorageQueryResolver(mockQueryBus, mockStorageGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storageFindById', () => {
    it('should execute query bus and map result to response DTO', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageFindByIdRequestDto = {
        id: storageId,
      };

      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModelDto: IStorageCreateViewModelDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt,
        updatedAt,
      };
      const viewModel = new StorageViewModel(viewModelDto);

      const responseDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockStorageGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.storageFindById(input);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(StorageFindByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(StorageFindByIdQuery);
      expect(query.id.value).toBe(storageId);
      expect(mockStorageGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
      expect(result).toBe(responseDto);
    });

    it('should return null when storage is not found', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageFindByIdRequestDto = {
        id: storageId,
      };

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await resolver.storageFindById(input);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(StorageFindByIdQuery),
      );
      expect(mockStorageGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle errors from query bus', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageFindByIdRequestDto = {
        id: storageId,
      };

      const error = new Error('Storage not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.storageFindById(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(StorageFindByIdQuery),
      );
      expect(mockStorageGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });

  describe('storageFindByCriteria', () => {
    it('should execute query bus with criteria and map result to paginated response DTO', async () => {
      const input: StorageFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: StorageViewModel[] = [
        new StorageViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          fileName: 'file1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          provider: StorageProviderEnum.S3,
          url: 'https://example.com/files/file1.pdf',
          path: 'files/file1.pdf',
          createdAt,
          updatedAt,
        }),
        new StorageViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          fileName: 'file2.jpg',
          fileSize: 2048,
          mimeType: 'image/jpeg',
          provider: StorageProviderEnum.SUPABASE,
          url: 'https://supabase.example.com/files/file2.jpg',
          path: 'files/file2.jpg',
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);
      const paginatedResponseDto: PaginatedStorageResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            fileName: 'file1.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
            provider: StorageProviderEnum.S3,
            url: 'https://example.com/files/file1.pdf',
            path: 'files/file1.pdf',
            createdAt,
            updatedAt,
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            fileName: 'file2.jpg',
            fileSize: 2048,
            mimeType: 'image/jpeg',
            provider: StorageProviderEnum.SUPABASE,
            url: 'https://supabase.example.com/files/file2.jpg',
            path: 'files/file2.jpg',
            createdAt,
            updatedAt,
          },
        ],
        total: 2,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockStorageGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.storageFindByCriteria(input);

      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      const executedQuery = mockQueryBus.execute.mock
        .calls[0][0] as StorageFindByCriteriaQuery;
      expect(executedQuery).toBeInstanceOf(StorageFindByCriteriaQuery);
      expect(executedQuery.criteria).toBeInstanceOf(Criteria);
      expect(executedQuery.criteria.filters).toEqual([]);
      expect(executedQuery.criteria.sorts).toEqual([]);
      expect(executedQuery.criteria.pagination).toEqual({
        page: 1,
        perPage: 10,
      });
      expect(
        mockStorageGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
      expect(result).toBe(paginatedResponseDto);
    });

    it('should handle undefined input and use default criteria', async () => {
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: StorageViewModel[] = [
        new StorageViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          fileName: 'file1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          provider: StorageProviderEnum.S3,
          url: 'https://example.com/files/file1.pdf',
          path: 'files/file1.pdf',
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedStorageResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            fileName: 'file1.pdf',
            fileSize: 1024,
            mimeType: 'application/pdf',
            provider: StorageProviderEnum.S3,
            url: 'https://example.com/files/file1.pdf',
            path: 'files/file1.pdf',
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
      mockStorageGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.storageFindByCriteria(undefined);

      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      const executedQuery = mockQueryBus.execute.mock
        .calls[0][0] as StorageFindByCriteriaQuery;
      expect(executedQuery).toBeInstanceOf(StorageFindByCriteriaQuery);
      expect(executedQuery.criteria).toBeInstanceOf(Criteria);
      expect(
        mockStorageGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
      expect(result).toBe(paginatedResponseDto);
    });

    it('should handle errors from query bus', async () => {
      const input: StorageFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Database error');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.storageFindByCriteria(input)).rejects.toThrow(
        error,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(StorageFindByCriteriaQuery),
      );
      expect(
        mockStorageGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });
});
