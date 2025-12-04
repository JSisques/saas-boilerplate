import { ISagaLogCreateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-create/saga-log-create-view-model.dto';
import { ISagaLogUpdateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-update/saga-log-update-view-model.dto';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';

describe('SagaLogViewModel', () => {
  const createViewModelDto = (): ISagaLogCreateViewModelDto => {
    const now = new Date();
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
      sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
      type: SagaLogTypeEnum.INFO,
      message: 'Test log message',
      createdAt: now,
      updatedAt: now,
    };
  };

  describe('constructor', () => {
    it('should create a SagaLogViewModel with all properties', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.sagaInstanceId).toBe(dto.sagaInstanceId);
      expect(viewModel.sagaStepId).toBe(dto.sagaStepId);
      expect(viewModel.type).toBe(dto.type);
      expect(viewModel.message).toBe(dto.message);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a SagaLogViewModel with different log types', () => {
      const now = new Date();
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const dto: ISagaLogCreateViewModelDto = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
          createdAt: now,
          updatedAt: now,
        };

        const viewModel = new SagaLogViewModel(dto);

        expect(viewModel.type).toBe(type);
        expect(viewModel.message).toBe(dto.message);
      });
    });
  });

  describe('getters', () => {
    it('should expose id via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.id).toBe(dto.id);
    });

    it('should expose sagaInstanceId via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.sagaInstanceId).toBe(dto.sagaInstanceId);
    });

    it('should expose sagaStepId via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.sagaStepId).toBe(dto.sagaStepId);
    });

    it('should expose type via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.type).toBe(dto.type);
    });

    it('should expose message via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.message).toBe(dto.message);
    });

    it('should expose createdAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.createdAt).toEqual(dto.createdAt);
    });

    it('should expose updatedAt via getter', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);

      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should not allow modification of immutable fields', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalId = viewModel.id;
      const originalSagaInstanceId = viewModel.sagaInstanceId;
      const originalSagaStepId = viewModel.sagaStepId;
      const originalCreatedAt = viewModel.createdAt;

      // These fields are readonly, so they cannot be modified
      expect(viewModel.id).toBe(originalId);
      expect(viewModel.sagaInstanceId).toBe(originalSagaInstanceId);
      expect(viewModel.sagaStepId).toBe(originalSagaStepId);
      expect(viewModel.createdAt).toEqual(originalCreatedAt);
    });
  });

  describe('update', () => {
    it('should update type when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalType = viewModel.type;
      const beforeUpdate = new Date();

      viewModel.update({ type: SagaLogTypeEnum.ERROR });

      expect(viewModel.type).toBe(SagaLogTypeEnum.ERROR);
      expect(viewModel.type).not.toBe(originalType);
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should keep original type when undefined is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalType = viewModel.type;

      viewModel.update({});

      expect(viewModel.type).toBe(originalType);
    });

    it('should update message when new value is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalMessage = viewModel.message;
      const beforeUpdate = new Date();

      viewModel.update({ message: 'Updated message' });

      expect(viewModel.message).toBe('Updated message');
      expect(viewModel.message).not.toBe(originalMessage);
      expect(viewModel.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
    });

    it('should keep original message when undefined is provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalMessage = viewModel.message;

      viewModel.update({});

      expect(viewModel.message).toBe(originalMessage);
    });

    it('should update both type and message when both are provided', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalType = viewModel.type;
      const originalMessage = viewModel.message;

      const updateDto: ISagaLogUpdateViewModelDto = {
        type: SagaLogTypeEnum.WARNING,
        message: 'Updated message',
      };

      viewModel.update(updateDto);

      expect(viewModel.type).toBe(SagaLogTypeEnum.WARNING);
      expect(viewModel.type).not.toBe(originalType);
      expect(viewModel.message).toBe('Updated message');
      expect(viewModel.message).not.toBe(originalMessage);
    });

    it('should update updatedAt timestamp on any update', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalUpdatedAt = viewModel.updatedAt;

      // Wait a bit to ensure timestamp difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      viewModel.update({ type: SagaLogTypeEnum.DEBUG });

      expect(viewModel.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should not modify immutable fields during update', () => {
      const dto = createViewModelDto();
      const viewModel = new SagaLogViewModel(dto);
      const originalId = viewModel.id;
      const originalSagaInstanceId = viewModel.sagaInstanceId;
      const originalSagaStepId = viewModel.sagaStepId;
      const originalCreatedAt = viewModel.createdAt;

      viewModel.update({ type: SagaLogTypeEnum.ERROR });

      expect(viewModel.id).toBe(originalId);
      expect(viewModel.sagaInstanceId).toBe(originalSagaInstanceId);
      expect(viewModel.sagaStepId).toBe(originalSagaStepId);
      expect(viewModel.createdAt).toEqual(originalCreatedAt);
    });
  });
});
