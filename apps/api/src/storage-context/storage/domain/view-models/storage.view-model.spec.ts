import { StorageViewModel } from '@/storage-context/storage/domain/view-models/storage.view-model';
import { IStorageCreateViewModelDto } from '@/storage-context/storage/domain/dtos/view-models/storage-create-view-model/storage-create-view-model.dto';
import { StorageProviderEnum } from '@/storage-context/storage/domain/enums/storage-provider.enum';

describe('StorageViewModel', () => {
  const createViewModelDto = (): IStorageCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fileName: 'test-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
      provider: StorageProviderEnum.S3,
      url: 'https://example.com/files/test-file.pdf',
      path: 'files/test-file.pdf',
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a StorageViewModel with all properties', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel).toBeInstanceOf(StorageViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.fileName).toBe(dto.fileName);
      expect(viewModel.fileSize).toBe(dto.fileSize);
      expect(viewModel.mimeType).toBe(dto.mimeType);
      expect(viewModel.provider).toBe(dto.provider);
      expect(viewModel.url).toBe(dto.url);
      expect(viewModel.path).toBe(dto.path);
      expect(viewModel.createdAt).toBe(dto.createdAt);
      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
    });

    it('should expose fileName via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.fileName).toBe(dto.fileName);
    });

    it('should expose fileSize via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.fileSize).toBe(dto.fileSize);
    });

    it('should expose mimeType via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.mimeType).toBe(dto.mimeType);
    });

    it('should expose provider via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.provider).toBe(dto.provider);
    });

    it('should expose url via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.url).toBe(dto.url);
    });

    it('should expose path via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.path).toBe(dto.path);
    });

    it('should expose createdAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.createdAt).toBe(dto.createdAt);
    });

    it('should expose updatedAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });
  });

  describe('immutability', () => {
    it('should maintain immutability of properties', () => {
      const dto = createViewModelDto();
      const viewModel = new StorageViewModel(dto);
      const originalId = viewModel.id;
      const originalFileName = viewModel.fileName;

      // Properties should be readonly and not changeable
      expect(viewModel.id).toBe(originalId);
      expect(viewModel.fileName).toBe(originalFileName);
    });
  });

  describe('different provider values', () => {
    it('should create view model with S3 provider', () => {
      const dto = createViewModelDto();
      dto.provider = StorageProviderEnum.S3;
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.provider).toBe(StorageProviderEnum.S3);
    });

    it('should create view model with SUPABASE provider', () => {
      const dto = createViewModelDto();
      dto.provider = StorageProviderEnum.SUPABASE;
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.provider).toBe(StorageProviderEnum.SUPABASE);
    });

    it('should create view model with SERVER_ROUTE provider', () => {
      const dto = createViewModelDto();
      dto.provider = StorageProviderEnum.SERVER_ROUTE;
      const viewModel = new StorageViewModel(dto);

      expect(viewModel.provider).toBe(StorageProviderEnum.SERVER_ROUTE);
    });
  });
});
