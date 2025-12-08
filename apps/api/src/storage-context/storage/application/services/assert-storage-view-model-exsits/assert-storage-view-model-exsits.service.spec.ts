import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import { StorageNotFoundException } from '@/storage-context/storage/application/exceptions/storage-not-found/storage-not-found.exception';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Test } from '@nestjs/testing';

describe('AssertStorageViewModelExsistsService', () => {
  let service: AssertStorageViewModelExsistsService;
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
        AssertStorageViewModelExsistsService,
        {
          provide: STORAGE_READ_REPOSITORY_TOKEN,
          useValue: mockStorageReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertStorageViewModelExsistsService>(
      AssertStorageViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return storage view model when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const mockStorageViewModel = {
        id: storageId,
        fileName: 'test-file.pdf',
      } as StorageViewModel;

      mockStorageReadRepository.findById.mockResolvedValue(
        mockStorageViewModel,
      );

      const result = await service.execute(storageId);

      expect(result).toBe(mockStorageViewModel);
      expect(mockStorageReadRepository.findById).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockStorageReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw StorageNotFoundException when storage does not exist', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockStorageReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(storageId)).rejects.toThrow(
        StorageNotFoundException,
      );
      expect(mockStorageReadRepository.findById).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockStorageReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw StorageNotFoundException with correct message', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockStorageReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(storageId)).rejects.toThrow(
        `Storage with id ${storageId} not found`,
      );
    });

    it('should propagate errors from repository', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockStorageReadRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(storageId)).rejects.toThrow(repositoryError);
    });
  });
});
