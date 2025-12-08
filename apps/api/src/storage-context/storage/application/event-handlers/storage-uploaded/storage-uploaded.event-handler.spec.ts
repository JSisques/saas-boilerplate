import { StorageFileUploadedEvent } from '@/shared/domain/events/storage-context/storage/storage-file-uploaded/storage-file-uploaded.event';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { StorageUploadedEventHandler } from '@/storage-context/storage/application/event-handlers/storage-uploaded/storage-uploaded.event-handler';
import { StorageViewModelFactory } from '@/storage-context/storage/domain/factories/storage-view-model.factory';
import {
  STORAGE_READ_REPOSITORY_TOKEN,
  StorageReadRepository,
} from '@/storage-context/storage/domain/repositories/storage-read.repository';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { Test } from '@nestjs/testing';

describe('StorageUploadedEventHandler', () => {
  let handler: StorageUploadedEventHandler;
  let mockStorageReadRepository: jest.Mocked<StorageReadRepository>;
  let mockStorageViewModelFactory: jest.Mocked<StorageViewModelFactory>;

  beforeEach(async () => {
    mockStorageReadRepository = {
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<StorageReadRepository>;

    mockStorageViewModelFactory = {
      create: jest.fn(),
      fromAggregate: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<StorageViewModelFactory>;

    const module = await Test.createTestingModule({
      providers: [
        StorageUploadedEventHandler,
        {
          provide: STORAGE_READ_REPOSITORY_TOKEN,
          useValue: mockStorageReadRepository,
        },
        {
          provide: StorageViewModelFactory,
          useValue: mockStorageViewModelFactory,
        },
      ],
    }).compile();

    handler = module.get<StorageUploadedEventHandler>(
      StorageUploadedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save storage view model when event is handled', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const occurredAt = new Date('2024-01-01T10:00:00Z');
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: occurredAt,
        updatedAt: occurredAt,
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileUploadedEvent',
      };

      const event = new StorageFileUploadedEvent(metadata, eventData);

      const mockStorageViewModel = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: occurredAt,
        updatedAt: occurredAt,
      } as StorageViewModel;

      mockStorageViewModelFactory.create.mockReturnValue(mockStorageViewModel);
      mockStorageReadRepository.save.mockResolvedValue();

      await handler.handle(event);

      const createCall = mockStorageViewModelFactory.create.mock.calls[0][0];
      expect(createCall.id).toBe(storageId);
      expect(createCall.fileName).toBe('test-file.pdf');
      expect(createCall.fileSize).toBe(1024);
      expect(createCall.mimeType).toBe('application/pdf');
      expect(createCall.provider).toBe('S3');
      expect(createCall.url).toBe('https://example.com/files/test-file.pdf');
      expect(createCall.path).toBe('files/test-file.pdf');
      expect(createCall.createdAt).toBe(event.ocurredAt);
      expect(createCall.updatedAt).toBe(event.ocurredAt);
      expect(mockStorageReadRepository.save).toHaveBeenCalledWith(
        mockStorageViewModel,
      );
      expect(mockStorageViewModelFactory.create).toHaveBeenCalledTimes(1);
      expect(mockStorageReadRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should use event occurredAt for createdAt and updatedAt', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: new Date('2024-01-02T12:00:00Z'),
        updatedAt: new Date('2024-01-02T12:00:00Z'),
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileUploadedEvent',
      };

      const event = new StorageFileUploadedEvent(metadata, eventData);

      const mockStorageViewModel = {
        id: storageId,
      } as StorageViewModel;

      mockStorageViewModelFactory.create.mockReturnValue(mockStorageViewModel);
      mockStorageReadRepository.save.mockResolvedValue();

      await handler.handle(event);

      const createCall = mockStorageViewModelFactory.create.mock.calls[0][0];
      expect(createCall.id).toBe(storageId);
      expect(createCall.fileName).toBe('test-file.pdf');
      expect(createCall.fileSize).toBe(1024);
      expect(createCall.mimeType).toBe('application/pdf');
      expect(createCall.provider).toBe('S3');
      expect(createCall.url).toBe('https://example.com/files/test-file.pdf');
      expect(createCall.path).toBe('files/test-file.pdf');
      expect(createCall.createdAt).toBe(event.ocurredAt);
      expect(createCall.updatedAt).toBe(event.ocurredAt);
    });

    it('should propagate errors from StorageViewModelFactory', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const occurredAt = new Date('2024-01-01T10:00:00Z');
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: occurredAt,
        updatedAt: occurredAt,
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileUploadedEvent',
      };

      const event = new StorageFileUploadedEvent(metadata, eventData);

      const factoryError = new Error('Factory error');

      mockStorageViewModelFactory.create.mockImplementation(() => {
        throw factoryError;
      });

      await expect(handler.handle(event)).rejects.toThrow(factoryError);
    });

    it('should propagate errors from repository', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const occurredAt = new Date('2024-01-01T10:00:00Z');
      const eventData = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: 'S3',
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt: occurredAt,
        updatedAt: occurredAt,
      };

      const metadata: IEventMetadata = {
        aggregateId: storageId,
        aggregateType: 'StorageAggregate',
        eventType: 'StorageFileUploadedEvent',
      };

      const event = new StorageFileUploadedEvent(metadata, eventData);

      const mockStorageViewModel = {
        id: storageId,
      } as StorageViewModel;

      const repositoryError = new Error('Database error');

      mockStorageViewModelFactory.create.mockReturnValue(mockStorageViewModel);
      mockStorageReadRepository.save.mockRejectedValue(repositoryError);

      await expect(handler.handle(event)).rejects.toThrow(repositoryError);
    });
  });
});
