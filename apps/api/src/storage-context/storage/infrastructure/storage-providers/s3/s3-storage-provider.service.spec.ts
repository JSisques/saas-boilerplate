import { S3StorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/s3/s3-storage-provider.service';
import { ConfigService } from '@nestjs/config';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { S3UploadFailedException } from '@/storage-context/storage/infrastructure/exceptions/s3/s3-upload-failed.exception';
import { S3DownloadFailedException } from '@/storage-context/storage/infrastructure/exceptions/s3/s3-download-failed.exception';
import { S3DeleteFailedException } from '@/storage-context/storage/infrastructure/exceptions/s3/s3-delete-failed.exception';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Test } from '@nestjs/testing';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('S3StorageProviderService', () => {
  let service: S3StorageProviderService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockS3Client: jest.Mocked<S3Client>;
  let mockSend: jest.Mock;

  beforeEach(async () => {
    mockSend = jest.fn();

    mockS3Client = {
      send: mockSend,
    } as unknown as jest.Mocked<S3Client>;

    (S3Client as jest.MockedClass<typeof S3Client>).mockImplementation(
      () => mockS3Client,
    );

    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          AWS_ACCESS_KEY_ID: 'test-access-key',
          AWS_SECRET_ACCESS_KEY: 'test-secret-key',
          AWS_S3_BUCKET_NAME: 'test-bucket',
          AWS_S3_REGION: 'us-east-1',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    (getSignedUrl as jest.Mock) = jest
      .fn()
      .mockResolvedValue(
        'https://test-bucket.s3.amazonaws.com/files/test-file.pdf?signature=xxx',
      );

    const module = await Test.createTestingModule({
      providers: [
        S3StorageProviderService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<S3StorageProviderService>(S3StorageProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProviderType', () => {
    it('should return S3 provider type', () => {
      expect(service.getProviderType()).toBe(StorageProviderEnum.S3);
    });
  });

  describe('upload', () => {
    it('should upload file successfully and return URL', async () => {
      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      mockSend.mockResolvedValue({});

      const result = await service.upload(file, path, mimeType);

      expect(result).toContain('test-file.pdf');
      expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      const putCommand = mockSend.mock.calls[0][0];
      expect(putCommand).toBeInstanceOf(PutObjectCommand);
    });

    it('should throw S3UploadFailedException on upload error', async () => {
      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      mockSend.mockRejectedValue(new Error('Upload failed'));

      await expect(service.upload(file, path, mimeType)).rejects.toThrow(
        S3UploadFailedException,
      );
    });

    it('should throw S3UploadFailedException when AWS configuration is missing', async () => {
      // Create a new service instance with missing config to test getClient error
      mockConfigService.get.mockReturnValue(undefined);
      const newService = new S3StorageProviderService(mockConfigService);

      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      // The error from getClient is caught and re-thrown as S3UploadFailedException
      await expect(newService.upload(file, path, mimeType)).rejects.toThrow(
        S3UploadFailedException,
      );
    });
  });

  describe('download', () => {
    it('should download file successfully and return buffer', async () => {
      const path = 'files/test-file.pdf';
      const fileContent = Buffer.from('test file content');
      const chunks = [new Uint8Array(fileContent)];

      const mockStream = {
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield chunk;
          }
        },
      };

      mockSend.mockResolvedValue({
        Body: mockStream,
      });

      const result = await service.download(path);

      expect(result).toEqual(fileContent);
      expect(mockSend).toHaveBeenCalledWith(expect.any(GetObjectCommand));
      const getCommand = mockSend.mock.calls[0][0];
      expect(getCommand).toBeInstanceOf(GetObjectCommand);
    });

    it('should throw S3DownloadFailedException on download error', async () => {
      const path = 'files/test-file.pdf';

      mockSend.mockRejectedValue(new Error('Download failed'));

      await expect(service.download(path)).rejects.toThrow(
        S3DownloadFailedException,
      );
    });
  });

  describe('delete', () => {
    it('should delete file successfully and return true', async () => {
      const path = 'files/test-file.pdf';

      mockSend.mockResolvedValue({});

      const result = await service.delete(path);

      expect(result).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
      const deleteCommand = mockSend.mock.calls[0][0];
      expect(deleteCommand).toBeInstanceOf(DeleteObjectCommand);
    });

    it('should throw S3DeleteFailedException on delete error', async () => {
      const path = 'files/test-file.pdf';

      mockSend.mockRejectedValue(new Error('Delete failed'));

      await expect(service.delete(path)).rejects.toThrow(
        S3DeleteFailedException,
      );
    });
  });

  describe('getUrl', () => {
    it('should return signed URL for file path', async () => {
      const path = 'files/test-file.pdf';
      const expectedUrl =
        'https://test-bucket.s3.amazonaws.com/files/test-file.pdf?signature=xxx';

      (getSignedUrl as jest.Mock).mockResolvedValue(expectedUrl);

      const result = await service.getUrl(path);

      expect(result).toBe(expectedUrl);
      expect(getSignedUrl).toHaveBeenCalledWith(
        mockS3Client,
        expect.any(GetObjectCommand),
        { expiresIn: 3600 },
      );
    });
  });
});
