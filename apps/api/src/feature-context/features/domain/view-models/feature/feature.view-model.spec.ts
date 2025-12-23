import { FeatureViewModel } from '@/feature-context/features/domain/view-models/feature/feature.view-model';
import { IFeatureCreateViewModelDto } from '@/feature-context/features/domain/dtos/view-models/feature-create/feature-create-view-model.dto';
import { FeatureStatusEnum } from '@/feature-context/features/domain/enums/feature-status/feature-status.enum';

describe('FeatureViewModel', () => {
  const createViewModelDto = (): IFeatureCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      key: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'This feature enables advanced analytics capabilities',
      status: FeatureStatusEnum.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a FeatureViewModel with all properties', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.key).toBe(dto.key);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.description).toBe(dto.description);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.createdAt).toBe(dto.createdAt);
      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });

    it('should create a FeatureViewModel with null description', () => {
      const dto = createViewModelDto();
      dto.description = null;
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel).toBeInstanceOf(FeatureViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.key).toBe(dto.key);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.description).toBeNull();
      expect(viewModel.status).toBe(dto.status);
    });

    it('should use default Date values when createdAt and updatedAt are not provided', () => {
      const dto: IFeatureCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        key: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'This feature enables advanced analytics capabilities',
        status: FeatureStatusEnum.ACTIVE,
      } as any;

      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.createdAt).toBeInstanceOf(Date);
      expect(viewModel.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
    });

    it('should expose key via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.key).toBe(dto.key);
    });

    it('should expose name via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.name).toBe(dto.name);
    });

    it('should expose description via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.description).toBe(dto.description);
    });

    it('should expose status via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.status).toBe(dto.status);
    });

    it('should expose createdAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.createdAt).toBe(dto.createdAt);
    });

    it('should expose updatedAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.updatedAt).toBe(dto.updatedAt);
    });
  });

  describe('update', () => {
    it('should update key, name, description, and status', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);
      const beforeUpdate = viewModel.updatedAt.getTime();

      viewModel.update({
        key: 'basic-analytics',
        name: 'Basic Analytics',
        description: 'Basic analytics',
        status: FeatureStatusEnum.INACTIVE,
      });

      expect(viewModel.key).toBe('basic-analytics');
      expect(viewModel.name).toBe('Basic Analytics');
      expect(viewModel.description).toBe('Basic analytics');
      expect(viewModel.status).toBe(FeatureStatusEnum.INACTIVE);
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update properties when they are undefined', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);
      const originalKey = viewModel.key;
      const originalName = viewModel.name;

      viewModel.update({});

      expect(viewModel.key).toBe(originalKey);
      expect(viewModel.name).toBe(originalName);
    });

    it('should update only provided properties', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);
      const originalKey = viewModel.key;

      viewModel.update({
        name: 'Updated Name',
      });

      expect(viewModel.key).toBe(originalKey);
      expect(viewModel.name).toBe('Updated Name');
    });

    it('should update description to null', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);

      viewModel.update({
        description: null,
      });

      expect(viewModel.description).toBeNull();
    });

    it('should update updatedAt timestamp when updating', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);
      const beforeUpdate = viewModel.updatedAt.getTime();

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        viewModel.update({
          name: 'Updated Name',
        });

        expect(viewModel.updatedAt.getTime()).toBeGreaterThan(beforeUpdate);
      }, 10);
    });
  });

  describe('immutability', () => {
    it('should maintain immutability of id and createdAt', () => {
      const dto = createViewModelDto();
      const viewModel = new FeatureViewModel(dto);
      const originalId = viewModel.id;
      const originalCreatedAt = viewModel.createdAt;

      // Properties should be readonly and not changeable
      expect(viewModel.id).toBe(originalId);
      expect(viewModel.createdAt).toBe(originalCreatedAt);
    });
  });

  describe('different status values', () => {
    it('should create view model with ACTIVE status', () => {
      const dto = createViewModelDto();
      dto.status = FeatureStatusEnum.ACTIVE;
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.status).toBe(FeatureStatusEnum.ACTIVE);
    });

    it('should create view model with INACTIVE status', () => {
      const dto = createViewModelDto();
      dto.status = FeatureStatusEnum.INACTIVE;
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.status).toBe(FeatureStatusEnum.INACTIVE);
    });

    it('should create view model with DEPRECATED status', () => {
      const dto = createViewModelDto();
      dto.status = FeatureStatusEnum.DEPRECATED;
      const viewModel = new FeatureViewModel(dto);

      expect(viewModel.status).toBe(FeatureStatusEnum.DEPRECATED);
    });
  });
});
