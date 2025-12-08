import { StorageFindByCriteriaQueryHandler } from '@/storage-context/storage/application/queries/storage-find-by-criteria/storage-find-by-criteria.query-handler';
import { StorageFindByCriteriaQuery } from '@/storage-context/storage/application/queries/storage-find-by-criteria/storage-find-by-criteria.query';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { IStorageFindByCriteriaQueryDto } from '@/storage-context/storage/application/dtos/queries/storage-find-by-criteria/storage-find-by-criteria-query.dto';
import { Test } from '@nestjs/testing';

describe('StorageFindByCriteriaQueryHandler', () => {
  let handler: StorageFindByCriteriaQueryHandler;
  let mockStorageReadRepository: jest.Mocked<StorageReadRepository>;

  beforeEach(async () => {
    mockStorageReadRepository = {
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<StorageReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        StorageFindByCriteriaQueryHandler,
        {
          provide: STORAGE_READ_REPOSITORY_TOKEN,
          useValue: mockStorageReadRepository,
        },
      ],
    }).compile();

    handler = module.get<StorageFindByCriteriaQueryHandler>(
      StorageFindByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result when storages are found', async () => {
      const criteria = new Criteria();
      const queryDto: IStorageFindByCriteriaQueryDto = { criteria };
      const query = new StorageFindByCriteriaQuery(queryDto);

      const mockStorage1 = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        fileName: 'file1.pdf',
      } as StorageViewModel;

      const mockStorage2 = {
        id: '223e4567-e89b-12d3-a456-426614174000',
        fileName: 'file2.pdf',
      } as StorageViewModel;

      const expectedResult = new PaginatedResult<StorageViewModel>(
        [mockStorage1, mockStorage2],
        2,
        1,
        10,
      );

      mockStorageReadRepository.findByCriteria.mockResolvedValue(
        expectedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(expectedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockStorageReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockStorageReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no storages are found', async () => {
      const criteria = new Criteria();
      const queryDto: IStorageFindByCriteriaQueryDto = { criteria };
      const query = new StorageFindByCriteriaQuery(queryDto);

      const expectedResult = new PaginatedResult<StorageViewModel>(
        [],
        0,
        1,
        10,
      );

      mockStorageReadRepository.findByCriteria.mockResolvedValue(
        expectedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(expectedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockStorageReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });

    it('should propagate errors from repository', async () => {
      const criteria = new Criteria();
      const queryDto: IStorageFindByCriteriaQueryDto = { criteria };
      const query = new StorageFindByCriteriaQuery(queryDto);
      const repositoryError = new Error('Database connection error');

      mockStorageReadRepository.findByCriteria.mockRejectedValue(
        repositoryError,
      );

      await expect(handler.execute(query)).rejects.toThrow(repositoryError);
    });
  });
});
