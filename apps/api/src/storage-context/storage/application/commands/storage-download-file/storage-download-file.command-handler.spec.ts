import { StorageDownloadFileCommandHandler } from '@/storage-context/storage/application/commands/storage-download-file/storage-download-file.command-handler';
import { StorageDownloadFileCommand } from '@/storage-context/storage/application/commands/storage-download-file/storage-download-file.command';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { IStorageDownloadFileCommandDto } from '@/storage-context/storage/application/dtos/commands/storage-download-file/storage-download-file-command.dto';

describe('StorageDownloadFileCommandHandler', () => {
  let handler: StorageDownloadFileCommandHandler;
  let mockStorageWriteRepository: jest.Mocked<StorageWriteRepository>;
  let mockStorageProviderFactory: jest.Mocked<StorageProviderFactoryService>;
  let mockStorageProvider: jest.Mocked<IStorageProvider>;
  let mockEventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    mockStorageProvider = {
      upload: jest.fn(),
      download: jest.fn(),
      delete: jest.fn(),
      getProviderType: jest.fn(),
    } as unknown as jest.Mocked<IStorageProvider>;

    mockStorageWriteRepository = {
      findById: jest.fn(),
      findByPath: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<StorageWriteRepository>;

    mockStorageProviderFactory = {
      getDefaultProvider: jest.fn(),
      getProvider: jest.fn(),
      getProviderType: jest.fn(),
    } as unknown as jest.Mocked<StorageProviderFactoryService>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    const module = await Test.createTestingModule({
      providers: [
        StorageDownloadFileCommandHandler,
        {
          provide: STORAGE_WRITE_REPOSITORY_TOKEN,
          useValue: mockStorageWriteRepository,
        },
        {
          provide: StorageProviderFactoryService,
          useValue: mockStorageProviderFactory,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<StorageDownloadFileCommandHandler>(
      StorageDownloadFileCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should download file successfully', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const filePath = 'files/test-file.pdf';
      const fileBuffer = Buffer.from('test file content');

      const commandDto: IStorageDownloadFileCommandDto = { id: storageId };
      const command = new StorageDownloadFileCommand(commandDto);

      const mockStorage = {
        id: { value: storageId },
        provider: { value: StorageProviderEnum.S3 },
        path: { value: filePath },
        markAsDownloaded: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as StorageAggregate;

      mockStorageWriteRepository.findById.mockResolvedValue(mockStorage);
      mockStorageProviderFactory.getProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProvider.download.mockResolvedValue(fileBuffer);

      const result = await handler.execute(command);

      expect(result).toBe(fileBuffer);
      expect(mockStorageWriteRepository.findById).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockStorageProviderFactory.getProvider).toHaveBeenCalledWith(
        StorageProviderEnum.S3,
      );
      expect(mockStorageProvider.download).toHaveBeenCalledWith(filePath);
      expect(mockStorage.markAsDownloaded).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockStorage.commit).toHaveBeenCalledTimes(1);
    });

    it('should throw error when storage is not found', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      const commandDto: IStorageDownloadFileCommandDto = { id: storageId };
      const command = new StorageDownloadFileCommand(commandDto);

      mockStorageWriteRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        'Storage not found',
      );
      expect(mockStorageWriteRepository.findById).toHaveBeenCalledWith(
        storageId,
      );
    });

    it('should propagate errors from storage provider', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const filePath = 'files/test-file.pdf';

      const commandDto: IStorageDownloadFileCommandDto = { id: storageId };
      const command = new StorageDownloadFileCommand(commandDto);

      const mockStorage = {
        id: { value: storageId },
        provider: { value: StorageProviderEnum.S3 },
        path: { value: filePath },
      } as unknown as StorageAggregate;

      const providerError = new Error('Download failed');

      mockStorageWriteRepository.findById.mockResolvedValue(mockStorage);
      mockStorageProviderFactory.getProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProvider.download.mockRejectedValue(providerError);

      await expect(handler.execute(command)).rejects.toThrow(providerError);
    });

    it('should propagate errors from repository', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      const commandDto: IStorageDownloadFileCommandDto = { id: storageId };
      const command = new StorageDownloadFileCommand(commandDto);

      const repositoryError = new Error('Database error');

      mockStorageWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(handler.execute(command)).rejects.toThrow(repositoryError);
    });
  });
});
