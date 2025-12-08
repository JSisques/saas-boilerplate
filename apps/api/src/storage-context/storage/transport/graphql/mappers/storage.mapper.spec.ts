import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';
import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { StorageGraphQLMapper } from '@/storage-context/storage/transport/graphql/mappers/storage.mapper';

describe('StorageGraphQLMapper', () => {
  let mapper: StorageGraphQLMapper;

  beforeEach(() => {
    mapper = new StorageGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert storage view model to response DTO with all properties', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModelDto: IStorageCreateViewModelDto = {
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt,
        updatedAt,
      };
      const viewModel = new StorageViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: storageId,
        fileName: 'test-file.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/test-file.pdf',
        path: 'files/test-file.pdf',
        createdAt,
        updatedAt,
      });
    });

    it('should convert storage view model with different provider', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModelDto: IStorageCreateViewModelDto = {
        id: storageId,
        fileName: 'image.jpg',
        fileSize: 2048,
        mimeType: 'image/jpeg',
        provider: StorageProviderEnum.SUPABASE,
        url: 'https://supabase.example.com/files/image.jpg',
        path: 'files/image.jpg',
        createdAt,
        updatedAt,
      };
      const viewModel = new StorageViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: storageId,
        fileName: 'image.jpg',
        fileSize: 2048,
        mimeType: 'image/jpeg',
        provider: StorageProviderEnum.SUPABASE,
        url: 'https://supabase.example.com/files/image.jpg',
        path: 'files/image.jpg',
        createdAt,
        updatedAt,
      });
    });

    it('should convert storage view model with SERVER_ROUTE provider', () => {
      const storageId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModelDto: IStorageCreateViewModelDto = {
        id: storageId,
        fileName: 'document.docx',
        fileSize: 4096,
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        provider: StorageProviderEnum.SERVER_ROUTE,
        url: 'https://storage.example.com/files/document.docx',
        path: 'files/document.docx',
        createdAt,
        updatedAt,
      };
      const viewModel = new StorageViewModel(viewModelDto);

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: storageId,
        fileName: 'document.docx',
        fileSize: 4096,
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        provider: StorageProviderEnum.SERVER_ROUTE,
        url: 'https://storage.example.com/files/document.docx',
        path: 'files/document.docx',
        createdAt,
        updatedAt,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: StorageViewModel[] = [
        new StorageViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          fileName: 'file1.pdf',
          fileSize: 1024,
          mimeType: 'application/pdf',
          provider: StorageProviderEnum.S3,
          url: 'https://example.com/files/file1.pdf',
          path: 'files/file1.pdf',
          createdAt,
          updatedAt,
        }),
        new StorageViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          fileName: 'file2.jpg',
          fileSize: 2048,
          mimeType: 'image/jpeg',
          provider: StorageProviderEnum.SUPABASE,
          url: 'https://supabase.example.com/files/file2.jpg',
          path: 'files/file2.jpg',
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0]).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        fileName: 'file1.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
        provider: StorageProviderEnum.S3,
        url: 'https://example.com/files/file1.pdf',
        path: 'files/file1.pdf',
        createdAt,
        updatedAt,
      });
      expect(result.items[1]).toEqual({
        id: '223e4567-e89b-12d3-a456-426614174001',
        fileName: 'file2.jpg',
        fileSize: 2048,
        mimeType: 'image/jpeg',
        provider: StorageProviderEnum.SUPABASE,
        url: 'https://supabase.example.com/files/file2.jpg',
        path: 'files/file2.jpg',
        createdAt,
        updatedAt,
      });
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult<StorageViewModel>(
        [],
        0,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should convert paginated result with pagination metadata', () => {
      const createdAt = new Date('2024-01-01T10:00:00.000Z');
      const updatedAt = new Date('2024-01-02T12:00:00.000Z');
      const viewModels: StorageViewModel[] = Array.from(
        { length: 5 },
        (_, i) =>
          new StorageViewModel({
            id: `${i}e4567-e89b-12d3-a456-426614174000`,
            fileName: `file${i}.pdf`,
            fileSize: (i + 1) * 1024,
            mimeType: 'application/pdf',
            provider: StorageProviderEnum.S3,
            url: `https://example.com/files/file${i}.pdf`,
            path: `files/file${i}.pdf`,
            createdAt,
            updatedAt,
          }),
      );

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 5);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.totalPages).toBe(5);
      expect(result.items[0].fileName).toBe('file0.pdf');
      expect(result.items[4].fileName).toBe('file4.pdf');
    });
  });
});
