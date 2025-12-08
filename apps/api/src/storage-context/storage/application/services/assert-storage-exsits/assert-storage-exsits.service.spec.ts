import { AssertStorageExsistsService } from '@/storage-context/storage/application/services/assert-storage-exsits/assert-storage-exsits.service';
import { StorageNotFoundException } from '@/storage-context/storage/application/exceptions/storage-not-found/storage-not-found.exception';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { Test } from '@nestjs/testing';

describe('AssertStorageExsistsService', () => {
  let service: AssertStorageExsistsService;
  let mockStorageWriteRepository: jest.Mocked<StorageWriteRepository>;

  beforeEach(async () => {
    mockStorageWriteRepository = {
      findById: jest.fn(),
      findByPath: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<StorageWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertStorageExsistsService,
        {
          provide: STORAGE_WRITE_REPOSITORY_TOKEN,
          useValue: mockStorageWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertStorageExsistsService>(
      AssertStorageExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return storage aggregate when storage exists', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const mockStorage = {
        id: { value: storageId },
      } as StorageAggregate;

      mockStorageWriteRepository.findById.mockResolvedValue(mockStorage);

      const result = await service.execute(storageId);

      expect(result).toBe(mockStorage);
      expect(mockStorageWriteRepository.findById).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockStorageWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw StorageNotFoundException when storage does not exist', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockStorageWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(storageId)).rejects.toThrow(
        StorageNotFoundException,
      );
      expect(mockStorageWriteRepository.findById).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockStorageWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw StorageNotFoundException with correct message', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      mockStorageWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(storageId)).rejects.toThrow(
        `Storage with id ${storageId} not found`,
      );
    });

    it('should propagate errors from repository', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockStorageWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(storageId)).rejects.toThrow(repositoryError);
    });
  });
});
