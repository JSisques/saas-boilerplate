import { StorageFileDeletedEventHandler } from '@/storage-context/storage/application/event-handlers/storage-file-deleted/storage-file-deleted.event-handler';
import { StorageFileDeletedEvent } from '@/shared/domain/events/storage-context/storage/storage-deleted/storage-deleted.event';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { Test } from '@nestjs/testing';

describe('StorageFileDeletedEventHandler', () => {
  let handler: StorageFileDeletedEventHandler;
  let mockStorageReadRepository: jest.Mocked<StorageReadRepository>;
  let mockAssertStorageViewModelExsistsService: jest.Mocked<AssertStorageViewModelExsistsService>;

  beforeEach(async () => {
    mockStorageReadRepository = {
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<StorageReadRepository>;

    mockAssertStorageViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertStorageViewModelExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        StorageFileDeletedEventHandler,
        {
          provide: STORAGE_READ_REPOSITORY_TOKEN,
          useValue: mockStorageReadRepository,
        },
        {
          provide: AssertStorageViewModelExsistsService,
          useValue: mockAssertStorageViewModelExsistsService,
        },
      ],
    }).compile();

    handler = module.get<StorageFileDeletedEventHandler>(
      StorageFileDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete storage view model when event is handled', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileDeletedEvent',
      };

      const event = new StorageFileDeletedEvent(metadata, eventData);

      const mockStorageViewModel = {
        id: storageId,
        fileName: 'test-file.pdf',
      } as StorageViewModel;

      mockAssertStorageViewModelExsistsService.execute.mockResolvedValue(
        mockStorageViewModel,
      );
      mockStorageReadRepository.delete.mockResolvedValue(true);

      await handler.handle(event);

      expect(
        mockAssertStorageViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(storageId);
      expect(mockStorageReadRepository.delete).toHaveBeenCalledWith(storageId);
      expect(
        mockAssertStorageViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
      expect(mockStorageReadRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from AssertStorageViewModelExsistsService', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileDeletedEvent',
      };

      const event = new StorageFileDeletedEvent(metadata, eventData);

      const serviceError = new Error('Storage view model not found');

      mockAssertStorageViewModelExsistsService.execute.mockRejectedValue(
        serviceError,
      );

      await expect(handler.handle(event)).rejects.toThrow(serviceError);
    });

    it('should propagate errors from repository', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileDeletedEvent',
      };

      const event = new StorageFileDeletedEvent(metadata, eventData);

      const mockStorageViewModel = {
        id: storageId,
        fileName: 'test-file.pdf',
      } as StorageViewModel;

      const repositoryError = new Error('Database error');

      mockAssertStorageViewModelExsistsService.execute.mockResolvedValue(
        mockStorageViewModel,
      );
      mockStorageReadRepository.delete.mockRejectedValue(repositoryError);

      await expect(handler.handle(event)).rejects.toThrow(repositoryError);
    });
  });
});
