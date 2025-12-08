import { SupabaseStorageProviderService } from '@/storage-context/storage/infrastructure/storage-providers/supabase/supabase-storage-provider.service';
import { ConfigService } from '@nestjs/config';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { SupabaseUploadFailedException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-upload-failed.exception';
import { SupabaseDownloadFailedException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-download-failed.exception';
import { SupabaseDeleteFailedException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-delete-failed.exception';
import { SupabaseFileNotFoundException } from '@/storage-context/storage/infrastructure/exceptions/supabase/supabase-file-not-found.exception';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Test } from '@nestjs/testing';

jest.mock('@supabase/supabase-js');

describe('SupabaseStorageProviderService', () => {
  let service: SupabaseStorageProviderService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockSupabaseClient: jest.Mocked<SupabaseClient>;
  let mockStorage: any;

  beforeEach(async () => {
    mockStorage = {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(),
    };

    mockSupabaseClient = {
      storage: mockStorage,
    } as unknown as jest.Mocked<SupabaseClient>;

    (createClient as jest.MockedFunction<typeof createClient>).mockReturnValue(
      mockSupabaseClient as any,
    );

    mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          SUPABASE_URL: 'https://test.supabase.co',
          SUPABASE_KEY: 'test-supabase-key',
          SUPABASE_STORAGE_BUCKET: 'files',
        };
        return config[key];
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module = await Test.createTestingModule({
      providers: [
        SupabaseStorageProviderService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SupabaseStorageProviderService>(
      SupabaseStorageProviderService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProviderType', () => {
    it('should return SUPABASE provider type', () => {
      expect(service.getProviderType()).toBe(StorageProviderEnum.SUPABASE);
    });
  });

  describe('upload', () => {
    it('should upload file successfully and return URL', async () => {
      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';
      const expectedUrl =
        'https://test.supabase.co/storage/v1/object/public/files/files/test-file.pdf';

      mockStorage.upload.mockResolvedValue({ error: null });
      mockStorage.getPublicUrl.mockReturnValue({
        data: { publicUrl: expectedUrl },
      });

      const result = await service.upload(file, path, mimeType);

      expect(result).toBe(expectedUrl);
      expect(mockStorage.from).toHaveBeenCalledWith('files');
      expect(mockStorage.upload).toHaveBeenCalledWith(path, file, {
        contentType: mimeType,
        upsert: true,
      });
    });

    it('should throw SupabaseUploadFailedException on upload error', async () => {
      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      mockStorage.upload.mockResolvedValue({
        error: { message: 'Upload failed' },
      });

      await expect(service.upload(file, path, mimeType)).rejects.toThrow(
        SupabaseUploadFailedException,
      );
    });

    it('should throw error when Supabase configuration is missing', async () => {
      mockConfigService.get.mockReturnValue(undefined);

      const file = Buffer.from('test file content');
      const path = 'files/test-file.pdf';
      const mimeType = 'application/pdf';

      await expect(service.upload(file, path, mimeType)).rejects.toThrow(
        'Supabase configuration is missing',
      );
    });
  });

  describe('download', () => {
    it('should download file successfully and return buffer', async () => {
      const path = 'files/test-file.pdf';
      const fileContent = Buffer.from('test file content');
      const blob = new Blob([fileContent]);

      mockStorage.download.mockResolvedValue({
        data: blob,
        error: null,
      });

      const result = await service.download(path);

      expect(result).toEqual(fileContent);
      expect(mockStorage.from).toHaveBeenCalledWith('files');
      expect(mockStorage.download).toHaveBeenCalledWith(path);
    });

    it('should extract relative path from URL when downloading', async () => {
      const url =
        'https://test.supabase.co/storage/v1/object/public/files/files/test-file.pdf';
      const fileContent = Buffer.from('test file content');
      const blob = new Blob([fileContent]);

      mockStorage.download.mockResolvedValue({
        data: blob,
        error: null,
      });

      await service.download(url);

      expect(mockStorage.download).toHaveBeenCalledWith('files/test-file.pdf');
    });

    it('should throw SupabaseDownloadFailedException on download error', async () => {
      const path = 'files/test-file.pdf';

      mockStorage.download.mockResolvedValue({
        data: null,
        error: { message: 'Download failed' },
      });

      await expect(service.download(path)).rejects.toThrow(
        SupabaseDownloadFailedException,
      );
    });

    it('should throw SupabaseFileNotFoundException when file data is null', async () => {
      const path = 'files/test-file.pdf';

      mockStorage.download.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(service.download(path)).rejects.toThrow(
        SupabaseFileNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete file successfully and return true', async () => {
      const path = 'files/test-file.pdf';

      mockStorage.remove.mockResolvedValue({ error: null });

      const result = await service.delete(path);

      expect(result).toBe(true);
      expect(mockStorage.from).toHaveBeenCalledWith('files');
      expect(mockStorage.remove).toHaveBeenCalledWith([path]);
    });

    it('should extract relative path from URL when deleting', async () => {
      const url =
        'https://test.supabase.co/storage/v1/object/public/files/files/test-file.pdf';

      mockStorage.remove.mockResolvedValue({ error: null });

      await service.delete(url);

      expect(mockStorage.remove).toHaveBeenCalledWith(['files/test-file.pdf']);
    });

    it('should throw SupabaseDeleteFailedException on delete error', async () => {
      const path = 'files/test-file.pdf';

      mockStorage.remove.mockResolvedValue({
        error: { message: 'Delete failed' },
      });

      await expect(service.delete(path)).rejects.toThrow(
        SupabaseDeleteFailedException,
      );
    });
  });

  describe('getUrl', () => {
    it('should return public URL for file path', async () => {
      const path = 'files/test-file.pdf';
      const expectedUrl =
        'https://test.supabase.co/storage/v1/object/public/files/files/test-file.pdf';

      mockStorage.getPublicUrl.mockReturnValue({
        data: { publicUrl: expectedUrl },
      });

      const result = await service.getUrl(path);

      expect(result).toBe(expectedUrl);
      expect(mockStorage.from).toHaveBeenCalledWith('files');
      expect(mockStorage.getPublicUrl).toHaveBeenCalledWith(path);
    });
  });
});
