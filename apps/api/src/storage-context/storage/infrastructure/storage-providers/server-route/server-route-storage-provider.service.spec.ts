import { ServerRouteStorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/server-route/server-route-storage-provider.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { ServerRouteUploadFailedException } from '@/storage-context/storage/infrastructure/exceptions/server-route/server-route-upload-failed.exception';
import { ServerRouteDownloadFailedException } from '@/storage-context/storage/infrastructure/exceptions/server-route/server-route-download-failed.exception';
import { ServerRouteDeleteFailedException } from '@/storage-context/storage/infrastructure/exceptions/server-route/server-route-delete-failed.exception';
import { Test } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('ServerRouteStorageProviderService', () => {
  let service: ServerRouteStorageProviderService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockHttpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          STORAGE_SERVER_ROUTE_URL: 'https://storage.example.com',
          STORAGE_SERVER_ROUTE_API_KEY: 'test-api-key',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    mockHttpService = {
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    const module = await Test.createTestingModule({
      providers: [
        ServerRouteStorageProviderService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<ServerRouteStorageProviderService>(
      ServerRouteStorageProviderService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProviderType', () => {
    it('should return SERVER_ROUTE provider type', () => {
      expect(service.getProviderType()).toBe(StorageProviderEnum.SERVER_ROUTE);
    });
  });

  describe('upload', () => {
    it('should upload file successfully and return URL', async () => {
      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';
      const expectedUrl = 'https://storage.example.com/files/test-file.pdf';

      const mockResponse: AxiosResponse = {
        data: { url: expectedUrl },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await service.upload(file, path, mimeType);

      expect(result).toBe(expectedUrl);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://storage.example.com/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer test-api-key',
          }),
        }),
      );
    });

    it('should throw ServerRouteUploadFailedException on upload error', async () => {
      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('Upload failed')),
      );

      await expect(service.upload(file, path, mimeType)).rejects.toThrow(
        ServerRouteUploadFailedException,
      );
    });

    it('should throw ServerRouteUploadFailedException when STORAGE_SERVER_ROUTE_URL is missing', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'STORAGE_SERVER_ROUTE_URL') {
          return undefined;
        }
        return 'test-api-key';
      });

      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      await expect(service.upload(file, path, mimeType)).rejects.toThrow(
        ServerRouteUploadFailedException,
      );
    });

    it('should throw ServerRouteUploadFailedException when STORAGE_SERVER_ROUTE_API_KEY is missing', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'STORAGE_SERVER_ROUTE_API_KEY') {
          return undefined;
        }
        return 'https://storage.example.com';
      });

      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      await expect(service.upload(file, path, mimeType)).rejects.toThrow(
        ServerRouteUploadFailedException,
      );
    });
  });

  describe('download', () => {
    it('should download file successfully and return buffer', async () => {
      const path = 'files/test-file.pdf';
      const fileContent = Buffer.from('test file content');

      const mockResponse: AxiosResponse = {
        data: fileContent,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.download(path);

      expect(result).toEqual(fileContent);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://storage.example.com/download/files/test-file.pdf',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
          responseType: 'arraybuffer',
        }),
      );
    });

    it('should throw ServerRouteDownloadFailedException on download error', async () => {
      const path = 'files/test-file.pdf';

      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('Download failed')),
      );

      await expect(service.download(path)).rejects.toThrow(
        ServerRouteDownloadFailedException,
      );
    });
  });

  describe('delete', () => {
    it('should delete file successfully and return true', async () => {
      const path = 'files/test-file.pdf';

      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.delete.mockReturnValue(of(mockResponse));

      const result = await service.delete(path);

      expect(result).toBe(true);
      expect(mockHttpService.delete).toHaveBeenCalledWith(
        'https://storage.example.com/delete/files/test-file.pdf',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        }),
      );
    });

    it('should throw ServerRouteDeleteFailedException on delete error', async () => {
      const path = 'files/test-file.pdf';

      mockHttpService.delete.mockReturnValue(
        throwError(() => new Error('Delete failed')),
      );

      await expect(service.delete(path)).rejects.toThrow(
        ServerRouteDeleteFailedException,
      );
    });
  });

  describe('getUrl', () => {
    it('should return URL for file path', async () => {
      const path = 'files/test-file.pdf';

      const result = await service.getUrl(path);

      expect(result).toBe(
        'https://storage.example.com/files/files/test-file.pdf',
      );
    });
  });
});
