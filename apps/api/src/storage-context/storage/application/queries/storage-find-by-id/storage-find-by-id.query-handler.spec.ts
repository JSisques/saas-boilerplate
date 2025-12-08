import { StorageFindByIdQueryHandler } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query-handler';
import { StorageFindByIdQuery } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query';
import { AssertStorageExsistsService } from '@/storage-context/storage/application/services/assert-storage-exsits/assert-storage-exsits.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { IStorageFindByIdQueryDto } from '@/storage-context/storage/application/dtos/queries/storage-find-by-id/storage-find-by-id-query.dto';

describe('StorageFindByIdQueryHandler', () => {
  let handler: StorageFindByIdQueryHandler;
  let mockAssertStorageExsistsService: jest.Mocked<AssertStorageExsistsService>;

  beforeEach(() => {
    mockAssertStorageExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertStorageExsistsService>;

    handler = new StorageFindByIdQueryHandler(mockAssertStorageExsistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return storage aggregate when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IStorageFindByIdQueryDto = { id: storageId };
      const query = new StorageFindByIdQuery(queryDto);

      const mockStorage = {
        id: { value: storageId },
      } as StorageAggregate;

      mockAssertStorageExsistsService.execute.mockResolvedValue(mockStorage);

      const result = await handler.execute(query);

      expect(result).toBe(mockStorage);
      expect(mockAssertStorageExsistsService.execute).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockAssertStorageExsistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from AssertStorageExsistsService', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IStorageFindByIdQueryDto = { id: storageId };
      const query = new StorageFindByIdQuery(queryDto);
      const serviceError = new Error('Storage not found');

      mockAssertStorageExsistsService.execute.mockRejectedValue(serviceError);

      await expect(handler.execute(query)).rejects.toThrow(serviceError);
      expect(mockAssertStorageExsistsService.execute).toHaveBeenCalledWith(
        storageId,
      );
    });
  });
});
