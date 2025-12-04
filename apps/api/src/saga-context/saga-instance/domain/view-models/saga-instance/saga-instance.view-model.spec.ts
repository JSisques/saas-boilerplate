import { ISagaInstanceCreateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-create/saga-instance-create-view-model.dto';
import { ISagaInstanceUpdateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-update/saga-instance-update-view-model.dto';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';

describe('SagaInstanceViewModel', () => {
  const createViewModelDto = (): ISagaInstanceCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Order Processing Saga',
      status: SagaInstanceStatusEnum.PENDING,
      startDate: null,
      endDate: null,
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a SagaInstanceViewModel with all properties', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.startDate).toBe(dto.startDate);
      expect(viewModel.endDate).toBe(dto.endDate);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a SagaInstanceViewModel with all optional fields set', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const dto: ISagaInstanceCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.startDate).toEqual(startDate);
      expect(viewModel.endDate).toEqual(endDate);
      expect(viewModel.status).toBe(SagaInstanceStatusEnum.COMPLETED);
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
    });

    it('should expose name via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.name).toBe(dto.name);
    });

    it('should expose status via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.status).toBe(dto.status);
    });

    it('should expose startDate via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.startDate).toBe(dto.startDate);
    });

    it('should expose endDate via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.endDate).toBe(dto.endDate);
    });

    it('should expose createdAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.createdAt).toEqual(dto.createdAt);
    });

    it('should expose updatedAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaInstanceViewModel(dto);

      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });
  });

  describe('update', () => {
    it('should update name', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const originalName = viewModel.name;
      const originalUpdatedAt = viewModel.updatedAt;

      const updateData: ISagaInstanceUpdateViewModelDto = {
        name: 'Updated Saga Name',
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Updated Saga Name');
      expect(viewModel.name).not.toBe(originalName);
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should update status', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const originalStatus = viewModel.status;

      const updateData: ISagaInstanceUpdateViewModelDto = {
        status: SagaInstanceStatusEnum.STARTED,
      };

      viewModel.update(updateData);

      expect(viewModel.status).toBe(SagaInstanceStatusEnum.STARTED);
      expect(viewModel.status).not.toBe(originalStatus);
    });

    it('should update startDate', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const newStartDate = new Date('2024-01-01T10:00:00Z');

      const updateData: ISagaInstanceUpdateViewModelDto = {
        startDate: newStartDate,
      };

      viewModel.update(updateData);

      expect(viewModel.startDate).toEqual(newStartDate);
    });

    it('should update endDate', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const newEndDate = new Date('2024-01-01T11:00:00Z');

      const updateData: ISagaInstanceUpdateViewModelDto = {
        endDate: newEndDate,
      };

      viewModel.update(updateData);

      expect(viewModel.endDate).toEqual(newEndDate);
    });

    it('should update multiple fields at once', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const newStartDate = new Date('2024-01-01T10:00:00Z');
      const newEndDate = new Date('2024-01-01T11:00:00Z');

      const updateData: ISagaInstanceUpdateViewModelDto = {
        name: 'Multi Updated Saga',
        status: SagaInstanceStatusEnum.RUNNING,
        startDate: newStartDate,
        endDate: newEndDate,
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Multi Updated Saga');
      expect(viewModel.status).toBe(SagaInstanceStatusEnum.RUNNING);
      expect(viewModel.startDate).toEqual(newStartDate);
      expect(viewModel.endDate).toEqual(newEndDate);
    });

    it('should not update fields that are undefined', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const originalName = viewModel.name;
      const originalStatus = viewModel.status;

      const updateData: ISagaInstanceUpdateViewModelDto = {};

      viewModel.update(updateData);

      expect(viewModel.name).toBe(originalName);
      expect(viewModel.status).toBe(originalStatus);
    });

    it('should set startDate to null when null is provided', () => {
      const now = new Date();
      const dto: ISagaInstanceCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };
      const viewModel = new SagaInstanceViewModel(dto);

      viewModel.update({ startDate: null });

      expect(viewModel.startDate).toBeNull();
    });

    it('should set endDate to null when null is provided', () => {
      const now = new Date();
      const dto: ISagaInstanceCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: now,
        updatedAt: now,
      };
      const viewModel = new SagaInstanceViewModel(dto);

      viewModel.update({ endDate: null });

      expect(viewModel.endDate).toBeNull();
    });

    it('should always update updatedAt timestamp', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const originalUpdatedAt = viewModel.updatedAt;

      // Wait a bit to ensure timestamp difference
      const updateData: ISagaInstanceUpdateViewModelDto = {
        name: 'Updated Name',
      };

      viewModel.update(updateData);

      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('immutability', () => {
    it('should not allow id to be changed', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const originalId = viewModel.id;

      // id is readonly, so we can't change it directly
      expect(viewModel.id).toBe(originalId);
    });

    it('should not allow createdAt to be changed', () => {
      const viewModel = new SagaInstanceViewModel(createViewModelDto());
      const originalCreatedAt = viewModel.createdAt;

      // createdAt is readonly, so we can't change it directly
      expect(viewModel.createdAt).toEqual(originalCreatedAt);
    });
  });
});
