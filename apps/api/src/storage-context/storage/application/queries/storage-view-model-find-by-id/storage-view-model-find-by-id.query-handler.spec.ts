import { StorageViewModelFindByIdQueryHandler } from '@/storage-context/storage/application/queries/storage-view-model-find-by-id/storage-view-model-find-by-id.query-handler';
import { StorageViewModelFindByIdQuery } from '@/storage-context/storage/application/queries/storage-view-model-find-by-id/storage-view-model-find-by-id.query';
import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { IStorageFindByIdQueryDto } from '@/storage-context/storage/application/dtos/queries/storage-find-by-id/storage-find-by-id-query.dto';

describe('StorageViewModelFindByIdQueryHandler', () => {
  let handler: StorageViewModelFindByIdQueryHandler;
  let mockAssertStorageViewModelExsistsService: jest.Mocked<AssertStorageViewModelExsistsService>;

  beforeEach(() => {
    mockAssertStorageViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertStorageViewModelExsistsService>;

    handler = new StorageViewModelFindByIdQueryHandler(
      mockAssertStorageViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return storage view model when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IStorageFindByIdQueryDto = { id: storageId };
      const query = new StorageViewModelFindByIdQuery(queryDto);

      const mockStorageViewModel = {
        id: storageId,
        fileName: 'test-file.pdf',
      } as StorageViewModel;

      mockAssertStorageViewModelExsistsService.execute.mockResolvedValue(
        mockStorageViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockStorageViewModel);
      expect(
        mockAssertStorageViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(storageId);
      expect(
        mockAssertStorageViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from AssertStorageViewModelExsistsService', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: IStorageFindByIdQueryDto = { id: storageId };
      const query = new StorageViewModelFindByIdQuery(queryDto);
      const serviceError = new Error('Storage not found');

      mockAssertStorageViewModelExsistsService.execute.mockRejectedValue(
        serviceError,
      );

      await expect(handler.execute(query)).rejects.toThrow(serviceError);
      expect(
        mockAssertStorageViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(storageId);
    });
  });
});
