import { ISagaStepCreateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-create/saga-step-create-view-model.dto';
import { ISagaStepUpdateViewModelDto } from '@/saga-context/saga-step/domain/dtos/view-models/saga-step-update/saga-step-update-view-model.dto';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';

describe('SagaStepViewModel', () => {
  const createViewModelDto = (): ISagaStepCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
      name: 'Process Payment',
      order: 1,
      status: SagaStepStatusEnum.PENDING,
      startDate: null,
      endDate: null,
      errorMessage: null,
      retryCount: 0,
      maxRetries: 3,
      payload: { orderId: '12345' },
      result: {},
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a SagaStepViewModel with all properties', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.sagaInstanceId).toBe(dto.sagaInstanceId);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.order).toBe(dto.order);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.startDate).toBe(dto.startDate);
      expect(viewModel.endDate).toBe(dto.endDate);
      expect(viewModel.errorMessage).toBe(dto.errorMessage);
      expect(viewModel.retryCount).toBe(dto.retryCount);
      expect(viewModel.maxRetries).toBe(dto.maxRetries);
      expect(viewModel.payload).toEqual(dto.payload);
      expect(viewModel.result).toEqual(dto.result);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a SagaStepViewModel with all optional fields set', () => {
      const now = new Date();
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const dto: ISagaStepCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: 'Test error',
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345', userId: '67890' },
        result: { success: true, transactionId: 'tx-123' },
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.startDate).toEqual(startDate);
      expect(viewModel.endDate).toEqual(endDate);
      expect(viewModel.errorMessage).toBe('Test error');
      expect(viewModel.retryCount).toBe(2);
      expect(viewModel.maxRetries).toBe(5);
      expect(viewModel.payload).toEqual({ orderId: '12345', userId: '67890' });
      expect(viewModel.result).toEqual({
        success: true,
        transactionId: 'tx-123',
      });
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
    });

    it('should expose sagaInstanceId via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.sagaInstanceId).toBe(dto.sagaInstanceId);
    });

    it('should expose name via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.name).toBe(dto.name);
    });

    it('should expose order via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.order).toBe(dto.order);
    });

    it('should expose status via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.status).toBe(dto.status);
    });

    it('should expose startDate via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.startDate).toBe(dto.startDate);
    });

    it('should expose endDate via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.endDate).toBe(dto.endDate);
    });

    it('should expose errorMessage via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.errorMessage).toBe(dto.errorMessage);
    });

    it('should expose retryCount via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.retryCount).toBe(dto.retryCount);
    });

    it('should expose maxRetries via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.maxRetries).toBe(dto.maxRetries);
    });

    it('should expose payload via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.payload).toEqual(dto.payload);
    });

    it('should expose result via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.result).toEqual(dto.result);
    });

    it('should expose createdAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.createdAt).toEqual(dto.createdAt);
    });

    it('should expose updatedAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });
  });

  describe('update', () => {
    it('should update name when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const originalName = viewModel.name;
      const beforeUpdate = new Date();

      viewModel.update({ name: 'Updated Step Name' });

      expect(viewModel.name).toBe('Updated Step Name');
      expect(viewModel.name).not.toBe(originalName);
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should keep original name when undefined is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const originalName = viewModel.name;

      viewModel.update({ name: undefined });

      expect(viewModel.name).toBe(originalName);
    });

    it('should update order when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ order: 5 });

      expect(viewModel.order).toBe(5);
    });

    it('should update status when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ status: SagaStepStatusEnum.STARTED });

      expect(viewModel.status).toBe(SagaStepStatusEnum.STARTED);
    });

    it('should update startDate when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const newStartDate = new Date('2024-01-01T10:00:00Z');

      viewModel.update({ startDate: newStartDate });

      expect(viewModel.startDate).toEqual(newStartDate);
    });

    it('should set startDate to null when null is provided', () => {
      const dto: ISagaStepCreateViewModelDto = {
        ...createViewModelDto(),
        startDate: new Date('2024-01-01T10:00:00Z'),
      };
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ startDate: null });

      expect(viewModel.startDate).toBeNull();
    });

    it('should update endDate when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const newEndDate = new Date('2024-01-01T11:00:00Z');

      viewModel.update({ endDate: newEndDate });

      expect(viewModel.endDate).toEqual(newEndDate);
    });

    it('should update errorMessage when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ errorMessage: 'New error message' });

      expect(viewModel.errorMessage).toBe('New error message');
    });

    it('should set errorMessage to null when null is provided', () => {
      const dto: ISagaStepCreateViewModelDto = {
        ...createViewModelDto(),
        errorMessage: 'Existing error',
      };
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ errorMessage: null });

      expect(viewModel.errorMessage).toBeNull();
    });

    it('should update retryCount when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ retryCount: 5 });

      expect(viewModel.retryCount).toBe(5);
    });

    it('should update maxRetries when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);

      viewModel.update({ maxRetries: 10 });

      expect(viewModel.maxRetries).toBe(10);
    });

    it('should update payload when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const newPayload = { newKey: 'newValue' };

      viewModel.update({ payload: newPayload });

      expect(viewModel.payload).toEqual(newPayload);
    });

    it('should update result when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const newResult = { success: true };

      viewModel.update({ result: newResult });

      expect(viewModel.result).toEqual(newResult);
    });

    it('should update multiple fields at once', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const updateData: ISagaStepUpdateViewModelDto = {
        name: 'Updated Name',
        order: 10,
        status: SagaStepStatusEnum.RUNNING,
        retryCount: 2,
      };

      viewModel.update(updateData);

      expect(viewModel.name).toBe('Updated Name');
      expect(viewModel.order).toBe(10);
      expect(viewModel.status).toBe(SagaStepStatusEnum.RUNNING);
      expect(viewModel.retryCount).toBe(2);
    });

    it('should update updatedAt timestamp', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const originalUpdatedAt = viewModel.updatedAt;
      const beforeUpdate = new Date();

      viewModel.update({ name: 'Updated' });

      const afterUpdate = new Date();
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should not update immutable fields (id, sagaInstanceId, createdAt)', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaStepViewModel(dto);
      const originalId = viewModel.id;
      const originalSagaInstanceId = viewModel.sagaInstanceId;
      const originalCreatedAt = viewModel.createdAt;

      viewModel.update({
        name: 'Updated',
      });

      // Verify immutable fields remain unchanged
      expect(viewModel.id).toBe(originalId);
      expect(viewModel.sagaInstanceId).toBe(originalSagaInstanceId);
      expect(viewModel.createdAt).toEqual(originalCreatedAt);
    });
  });
});
