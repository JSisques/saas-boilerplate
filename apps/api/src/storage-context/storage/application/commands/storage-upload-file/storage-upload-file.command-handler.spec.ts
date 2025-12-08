import { StorageUploadFileCommandHandler } from '@/storage-context/storage/application/commands/storage-upload-file/storage-upload-file.command-handler';
import { StorageUploadFileCommand } from '@/storage-context/storage/application/commands/storage-upload-file/storage-upload-file.command';
import {
  STORAGE_WRITE_REPOSITORY_TOKEN,
  StorageWriteRepository,
} from '@/storage-context/storage/domain/repositories/storage-write.repository';
import { StorageAggregateFactory } from '@/storage-context/storage/domain/factories/storage-aggregate.factory';
import { StorageProviderFactoryService } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider-factory.service';
import { IStorageProvider } from '@/storage-context/storage/infrastructure/storage-providers/storage-provider.interface';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { EventBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { IStorageUploadFileCommandProps } from '@/storage-context/storage/application/dtos/commands/storage-upload-file/storage-upload-file-command.dto';

describe('StorageUploadFileCommandHandler', () => {
  let handler: StorageUploadFileCommandHandler;
  let mockStorageWriteRepository: jest.Mocked<StorageWriteRepository>;
  let mockStorageAggregateFactory: jest.Mocked<StorageAggregateFactory>;
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

    mockStorageAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<StorageAggregateFactory>;

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
        StorageUploadFileCommandHandler,
        {
          provide: STORAGE_WRITE_REPOSITORY_TOKEN,
          useValue: mockStorageWriteRepository,
        },
        {
          provide: StorageAggregateFactory,
          useValue: mockStorageAggregateFactory,
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

    handler = module.get<StorageUploadFileCommandHandler>(
      StorageUploadFileCommandHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should upload file and create storage aggregate successfully', async () => {
      const buffer = Buffer.from('test file content');
      const fileName = 'test-file.pdf';
      const mimetype = 'application/pdf';
      const size = 1024;
      const uploadUrl = 'https://example.com/files/test-file.pdf';
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      const commandDto: IStorageUploadFileCommandProps = {
        buffer,
        fileName,
        mimetype,
        size,
      };
      const command = new StorageUploadFileCommand(commandDto);

      const mockStorage = {
        id: { value: storageId },
        markAsUploaded: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as any;

      mockStorageProviderFactory.getDefaultProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProviderFactory.getProviderType.mockReturnValue(
        StorageProviderEnum.S3,
      );
      mockStorageProvider.upload.mockResolvedValue(uploadUrl);
      mockStorageAggregateFactory.create.mockReturnValue(mockStorage);
      mockStorageWriteRepository.save.mockResolvedValue(mockStorage);

      const result = await handler.execute(command);

      expect(result).toBe(storageId);
      expect(
        mockStorageProviderFactory.getDefaultProvider,
      ).toHaveBeenCalledTimes(1);
      expect(mockStorageProvider.upload).toHaveBeenCalledWith(
        buffer,
        fileName,
        mimetype,
      );
      expect(mockStorageAggregateFactory.create).toHaveBeenCalledTimes(1);
      expect(mockStorageWriteRepository.save).toHaveBeenCalledWith(mockStorage);
      expect(mockStorage.markAsUploaded).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
      expect(mockStorage.commit).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from storage provider', async () => {
      const buffer = Buffer.from('test file content');
      const fileName = 'test-file.pdf';
      const mimetype = 'application/pdf';
      const size = 1024;

      const commandDto: IStorageUploadFileCommandProps = {
        buffer,
        fileName,
        mimetype,
        size,
      };
      const command = new StorageUploadFileCommand(commandDto);

      const providerError = new Error('Upload failed');

      mockStorageProviderFactory.getDefaultProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProvider.upload.mockRejectedValue(providerError);

      await expect(handler.execute(command)).rejects.toThrow(providerError);
    });

    it('should propagate errors from repository', async () => {
      const buffer = Buffer.from('test file content');
      const fileName = 'test-file.pdf';
      const mimetype = 'application/pdf';
      const size = 1024;
      const uploadUrl = 'https://example.com/files/test-file.pdf';

      const commandDto: IStorageUploadFileCommandProps = {
        buffer,
        fileName,
        mimetype,
        size,
      };
      const command = new StorageUploadFileCommand(commandDto);

      const mockStorage = {
        id: { value: '123e4567-e89b-12d3-a456-426614174000' },
        markAsUploaded: jest.fn(),
        getUncommittedEvents: jest.fn().mockReturnValue([]),
        commit: jest.fn(),
      } as unknown as any;

      const repositoryError = new Error('Database error');

      mockStorageProviderFactory.getDefaultProvider.mockReturnValue(
        mockStorageProvider,
      );
      mockStorageProviderFactory.getProviderType.mockReturnValue(
        StorageProviderEnum.S3,
      );
      mockStorageProvider.upload.mockResolvedValue(uploadUrl);
      mockStorageAggregateFactory.create.mockReturnValue(mockStorage);
      mockStorageWriteRepository.save.mockRejectedValue(repositoryError);

      await expect(handler.execute(command)).rejects.toThrow(repositoryError);
    });
  });
});
