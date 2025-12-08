// Mock graphql-upload module before importing the resolver
jest.mock('graphql-upload/GraphQLUpload.mjs', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseArrayDto } from '@/shared/transport/graphql/dtos/success-response-array.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { StorageUuidValueObject } from '@/shared/domain/value-objects/identifiers/storage-uuid/storage-uuid.vo';
import { StorageDeleteFileCommand } from '@/storage-context/storage/application/commands/storage-delete-file/storage-delete-file.command';
import { StorageDownloadFileCommand } from '@/storage-context/storage/application/commands/storage-download-file/storage-download-file.command';
import { StorageUploadFileCommand } from '@/storage-context/storage/application/commands/storage-upload-file/storage-upload-file.command';
import { StorageFindByIdQuery } from '@/storage-context/storage/application/queries/storage-find-by-id/storage-find-by-id.query';
import { StorageAggregate } from '@/storage-context/storage/domain/aggregate/storage.aggregate';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageFileNameValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-name/storage-file-name.vo';
import { StorageFileSizeValueObject } from '@/storage-context/storage/domain/value-objects/storage-file-size/storage-file-size.vo';
import { StorageMimeTypeValueObject } from '@/storage-context/storage/domain/value-objects/storage-mime-type/storage-mime-type.vo';
import { StoragePathValueObject } from '@/storage-context/storage/domain/value-objects/storage-path/storage-path.vo';
import { StorageProviderValueObject } from '@/storage-context/storage/domain/value-objects/storage-provider/storage-provider.vo';
import { StorageUrlValueObject } from '@/storage-context/storage/domain/value-objects/storage-url/storage-url.vo';
import { StorageDeleteFileRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-delete-file.request.dto';
import { StorageDownloadFileRequestDto } from '@/storage-context/storage/transport/graphql/dtos/requests/storage-download-file.request.dto';
import { StorageDownloadFileResponseDto } from '@/storage-context/storage/transport/graphql/dtos/responses/storage-download-file.response.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { FileUpload } from 'graphql-upload/processRequest.mjs';
import { StorageMutationsResolver } from './storage-mutations.resolver';

describe('StorageMutationsResolver', () => {
  let resolver: StorageMutationsResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockMutationResponseGraphQLMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockMutationResponseGraphQLMapper = {
      toResponseDto: jest.fn(),
      toResponseDtoArray: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new StorageMutationsResolver(
      mockCommandBus,
      mockQueryBus,
      mockMutationResponseGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('storageUploadFile', () => {
    it('should upload file successfully and return mutation response', async () => {
      const fileContent = Buffer.from('test file content');
      const filename = 'test-file.pdf';
      const mimetype = 'application/pdf';
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      // Mock FileUpload
      const mockFileUpload: FileUpload = {
        filename,
        mimetype,
        encoding: '7bit',
        createReadStream: jest.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            yield fileContent;
          },
        }),
      } as unknown as FileUpload;

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'File uploaded successfully',
        id: storageId,
      };

      mockCommandBus.execute.mockResolvedValue(storageId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.storageUploadFile(mockFileUpload);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(StorageUploadFileCommand),
      );
      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(StorageUploadFileCommand);
      expect(command.fileName.value).toBe(filename);
      expect(command.mimetype.value).toBe(mimetype);
      expect(command.buffer).toEqual(fileContent);
      expect(command.size.value).toBe(fileContent.length);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'File uploaded successfully',
        id: storageId,
      });
      expect(result).toBe(mutationResponse);
    });

    it('should handle file with multiple chunks', async () => {
      const chunk1 = Buffer.from('chunk1');
      const chunk2 = Buffer.from('chunk2');
      const chunk3 = Buffer.from('chunk3');
      const fullContent = Buffer.concat([chunk1, chunk2, chunk3]);
      const filename = 'large-file.pdf';
      const mimetype = 'application/pdf';
      const storageId = '123e4567-e89b-12d3-a456-426614174000';

      const mockFileUpload: FileUpload = {
        filename,
        mimetype,
        encoding: '7bit',
        createReadStream: jest.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            yield chunk1;
            yield chunk2;
            yield chunk3;
          },
        }),
      } as unknown as FileUpload;

      const mutationResponse: MutationResponseDto = {
        success: true,
        message: 'File uploaded successfully',
        id: storageId,
      };

      mockCommandBus.execute.mockResolvedValue(storageId);
      mockMutationResponseGraphQLMapper.toResponseDto.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.storageUploadFile(mockFileUpload);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.buffer).toEqual(fullContent);
      expect(command.size.value).toBe(fullContent.length);
      expect(result).toBe(mutationResponse);
    });

    it('should handle errors from command bus', async () => {
      const fileContent = Buffer.from('test file content');
      const filename = 'test-file.pdf';
      const mimetype = 'application/pdf';

      const mockFileUpload: FileUpload = {
        filename,
        mimetype,
        encoding: '7bit',
        createReadStream: jest.fn().mockReturnValue({
          [Symbol.asyncIterator]: async function* () {
            yield fileContent;
          },
        }),
      } as unknown as FileUpload;

      const error = new Error('Upload failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.storageUploadFile(mockFileUpload)).rejects.toThrow(
        error,
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(StorageUploadFileCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('storageDownloadFiles', () => {
    it('should download multiple files successfully', async () => {
      const storageId1 = '123e4567-e89b-12d3-a456-426614174000';
      const storageId2 = '223e4567-e89b-12d3-a456-426614174001';
      const input: StorageDownloadFileRequestDto = {
        ids: [storageId1, storageId2],
      };

      const now = new Date('2024-01-01T10:00:00.000Z');

      const storage1 = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId1),
          fileName: new StorageFileNameValueObject('file1.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject('https://example.com/files/file1.pdf'),
          path: new StoragePathValueObject('files/file1.pdf'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const storage2 = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId2),
          fileName: new StorageFileNameValueObject('file2.jpg'),
          fileSize: new StorageFileSizeValueObject(2048),
          mimeType: new StorageMimeTypeValueObject('image/jpeg'),
          provider: new StorageProviderValueObject(
            StorageProviderEnum.SUPABASE,
          ),
          url: new StorageUrlValueObject(
            'https://supabase.example.com/files/file2.jpg',
          ),
          path: new StoragePathValueObject('files/file2.jpg'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const fileBuffer1 = Buffer.from('file1 content');
      const fileBuffer2 = Buffer.from('file2 content');

      mockQueryBus.execute
        .mockResolvedValueOnce(storage1)
        .mockResolvedValueOnce(storage2);
      mockCommandBus.execute
        .mockResolvedValueOnce(fileBuffer1)
        .mockResolvedValueOnce(fileBuffer2);

      const result = await resolver.storageDownloadFiles(input);

      expect(mockQueryBus.execute).toHaveBeenCalledTimes(2);
      expect(mockQueryBus.execute).toHaveBeenNthCalledWith(
        1,
        expect.any(StorageFindByIdQuery),
      );
      expect(mockQueryBus.execute).toHaveBeenNthCalledWith(
        2,
        expect.any(StorageFindByIdQuery),
      );
      expect(mockCommandBus.execute).toHaveBeenCalledTimes(2);
      expect(mockCommandBus.execute).toHaveBeenNthCalledWith(
        1,
        expect.any(StorageDownloadFileCommand),
      );
      expect(mockCommandBus.execute).toHaveBeenNthCalledWith(
        2,
        expect.any(StorageDownloadFileCommand),
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        content: fileBuffer1.toString('base64'),
        fileName: 'file1.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
      });
      expect(result[1]).toEqual({
        content: fileBuffer2.toString('base64'),
        fileName: 'file2.jpg',
        mimeType: 'image/jpeg',
        fileSize: 2048,
      });
    });

    it('should download single file successfully', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageDownloadFileRequestDto = {
        ids: [storageId],
      };

      const now = new Date('2024-01-01T10:00:00.000Z');

      const storage = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject(
            'https://example.com/files/test-file.pdf',
          ),
          path: new StoragePathValueObject('files/test-file.pdf'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const fileBuffer = Buffer.from('test file content');

      mockQueryBus.execute.mockResolvedValue(storage);
      mockCommandBus.execute.mockResolvedValue(fileBuffer);

      const result = await resolver.storageDownloadFiles(input);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        content: fileBuffer.toString('base64'),
        fileName: 'test-file.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
      });
    });

    it('should handle errors from query bus', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageDownloadFileRequestDto = {
        ids: [storageId],
      };

      const error = new Error('Storage not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.storageDownloadFiles(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(StorageFindByIdQuery),
      );
      expect(mockCommandBus.execute).not.toHaveBeenCalled();
    });

    it('should handle errors from command bus', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageDownloadFileRequestDto = {
        ids: [storageId],
      };

      const now = new Date('2024-01-01T10:00:00.000Z');

      const storage = new StorageAggregate(
        {
          id: new StorageUuidValueObject(storageId),
          fileName: new StorageFileNameValueObject('test-file.pdf'),
          fileSize: new StorageFileSizeValueObject(1024),
          mimeType: new StorageMimeTypeValueObject('application/pdf'),
          provider: new StorageProviderValueObject(StorageProviderEnum.S3),
          url: new StorageUrlValueObject(
            'https://example.com/files/test-file.pdf',
          ),
          path: new StoragePathValueObject('files/test-file.pdf'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const error = new Error('Download failed');
      mockQueryBus.execute.mockResolvedValue(storage);
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.storageDownloadFiles(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(StorageFindByIdQuery),
      );
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(StorageDownloadFileCommand),
      );
    });
  });

  describe('storageDeleteFile', () => {
    it('should delete multiple files successfully', async () => {
      const storageId1 = '123e4567-e89b-12d3-a456-426614174000';
      const storageId2 = '223e4567-e89b-12d3-a456-426614174001';
      const input: StorageDeleteFileRequestDto = {
        ids: [storageId1, storageId2],
      };

      const mutationResponse: MutationResponseArrayDto = {
        success: true,
        message: 'Files deleted successfully',
        ids: [storageId1, storageId2],
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDtoArray.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.storageDeleteFile(input);

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(2);
      expect(mockCommandBus.execute).toHaveBeenNthCalledWith(
        1,
        expect.any(StorageDeleteFileCommand),
      );
      expect(mockCommandBus.execute).toHaveBeenNthCalledWith(
        2,
        expect.any(StorageDeleteFileCommand),
      );
      const command1 = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      const command2 = (mockCommandBus.execute as jest.Mock).mock.calls[1][0];
      expect(command1).toBeInstanceOf(StorageDeleteFileCommand);
      expect(command2).toBeInstanceOf(StorageDeleteFileCommand);
      expect(command1.id.value).toBe(storageId1);
      expect(command2.id.value).toBe(storageId2);
      expect(
        mockMutationResponseGraphQLMapper.toResponseDtoArray,
      ).toHaveBeenCalledWith({
        success: true,
        message: 'Files deleted successfully',
        ids: [storageId1, storageId2],
      });
      expect(result).toBe(mutationResponse);
    });

    it('should delete single file successfully', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageDeleteFileRequestDto = {
        ids: [storageId],
      };

      const mutationResponse: MutationResponseArrayDto = {
        success: true,
        message: 'Files deleted successfully',
        ids: [storageId],
      };

      mockCommandBus.execute.mockResolvedValue(undefined);
      mockMutationResponseGraphQLMapper.toResponseDtoArray.mockReturnValue(
        mutationResponse,
      );

      const result = await resolver.storageDeleteFile(input);

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(StorageDeleteFileCommand),
      );
      expect(result).toBe(mutationResponse);
    });

    it('should handle errors from command bus', async () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const input: StorageDeleteFileRequestDto = {
        ids: [storageId],
      };

      const error = new Error('Delete failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(resolver.storageDeleteFile(input)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(StorageDeleteFileCommand),
      );
      expect(
        mockMutationResponseGraphQLMapper.toResponseDtoArray,
      ).not.toHaveBeenCalled();
    });
  });
});
