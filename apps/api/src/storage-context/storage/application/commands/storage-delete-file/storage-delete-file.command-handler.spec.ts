import { StorageDeleteFileCommandHandler } from '@/storage-context/storage/application/commands/storage-delete-file/storage-delete-file.command-handler';
import { StorageDeleteFileCommand } from '@/storage-context/storage/application/commands/storage-delete-file/storage-delete-file.command';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { AssertStorageExsistsService } from '@/storage-context/storage/application/services/assert-storage-exsits/assert-storage-exsits.service';
import { AssertStorageViewModelExsistsService } from '@/storage-context/storage/application/services/assert-storage-view-model-exsits/assert-storage-view-model-exsits.service';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { IStorageDeleteFileCommandDto } from '@/storage-context/storage/application/dtos/commands/storage-delete-file/storage-delete-file-command.dto';

describe('StorageDeleteFileCommandHandler', () => {
  let handler: StorageDeleteFileCommandHandler;
  let mockStorageWriteRepository: jest.Mocked<StorageWriteRepository>;
  let mockStorageProviderFactory: jest.Mocked<StorageProviderFactoryService>;
  let mockStorageProvider: jest.Mocked<IStorageProvider>;
  let mockAssertStorageExsistsService: jest.Mocked<AssertStorageExsistsService>;
  let mockAssertStorageViewModelExsistsService: jest.Mocked<AssertStorageViewModelExsistsService>;
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

    mockAssertStorageExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertStorageExsistsService>;

    mockAssertStorageViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertStorageViewModelExsistsService>;

    mockEventBus = {
      publishAll: jest.fn(),
      publish: jest.fn(),
    } as unknown as jest.Mocked<EventBus>;

    const module = await Test.createTestingModule({
      providers: [
        StorageDeleteFileCommandHandler,
        {
          provide: STORAGE_WRITE_REPOSITORY_TOKEN,
          useValue: mockStorageWriteRepository,
        },
        {
          provide: StorageProviderFactoryService,
          useValue: mockStorageProviderFactory,
        },
        {
          provide: AssertStorageExsistsService,
          useValue: mockAssertStorageExsistsService,
        },
        {
          provide: AssertStorageViewModelExsistsService,
          useValue: mockAssertStorageViewModelExsistsService,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<StorageDeleteFileCommandHandler>(
      StorageDeleteFileCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should delete file and storage aggregate successfully', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const filePath = 'files/test-file.pdf';

      const commandDto: IStorageDeleteFileCommandDto = { id: storageId };
      const command = new StorageDeleteFileCommand(commandDto);

      const mockStorage = {
        id: { value: storageId },
        provider: { value: StorageProviderEnum.S3 },
        path: { value: filePath },
        delete: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as StorageAggregate;

      mockAssertStorageExsistsService.execute.mockResolvedValue(mockStorage);
      mockStorageProviderFactory.getProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProvider.delete.mockResolvedValue(true);
      mockStorageWriteRepository.delete.mockResolvedValue(true);

      const result = await handler.execute(command);

      expect(result).toBe(true);
      expect(mockAssertStorageExsistsService.execute).toHaveBeenCalledWith(
        storageId,
      );
      expect(mockStorageProviderFactory.getProvider).toHaveBeenCalledWith(
        StorageProviderEnum.S3,
      );
      expect(mockStorageProvider.delete).toHaveBeenCalledWith(filePath);
      expect(mockStorageWriteRepository.delete).toHaveBeenCalledWith(storageId);
      expect(mockStorage.delete).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockStorage.commit).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from AssertStorageExsistsService', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const commandDto: IStorageDeleteFileCommandDto = { id: storageId };
      const command = new StorageDeleteFileCommand(commandDto);

      const serviceError = new Error('Storage not found');

      mockAssertStorageExsistsService.execute.mockRejectedValue(serviceError);

      await expect(handler.execute(command)).rejects.toThrow(serviceError);
    });

    it('should propagate errors from storage provider', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const filePath = 'files/test-file.pdf';

      const commandDto: IStorageDeleteFileCommandDto = { id: storageId };
      const command = new StorageDeleteFileCommand(commandDto);

      const mockStorage = {
        id: { value: storageId },
        provider: { value: StorageProviderEnum.S3 },
        path: { value: filePath },
      } as unknown as StorageAggregate;

      const providerError = new Error('Delete failed');

      mockAssertStorageExsistsService.execute.mockResolvedValue(mockStorage);
      mockStorageProviderFactory.getProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProvider.delete.mockRejectedValue(providerError);

      await expect(handler.execute(command)).rejects.toThrow(providerError);
    });

    it('should propagate errors from repository', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const filePath = 'files/test-file.pdf';

      const commandDto: IStorageDeleteFileCommandDto = { id: storageId };
      const command = new StorageDeleteFileCommand(commandDto);

      const mockStorage = {
        id: { value: storageId },
        provider: { value: StorageProviderEnum.S3 },
        path: { value: filePath },
        delete: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as StorageAggregate;

      const repositoryError = new Error('Database error');

      mockAssertStorageExsistsService.execute.mockResolvedValue(mockStorage);
      mockStorageProviderFactory.getProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProvider.delete.mockResolvedValue(true);
      mockStorageWriteRepository.delete.mockRejectedValue(repositoryError);

      await expect(handler.execute(command)).rejects.toThrow(repositoryError);
    });
  });
});
