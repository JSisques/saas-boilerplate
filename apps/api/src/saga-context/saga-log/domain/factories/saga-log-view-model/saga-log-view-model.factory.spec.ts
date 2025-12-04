import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { ISagaLogCreateViewModelDto } from '@/saga-context/saga-log/domain/dtos/view-models/saga-log-create/saga-log-create-view-model.dto';
import { SagaLogViewModelFactory } from '@/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory';
import { SagaLogPrimitives } from '@/saga-context/saga-log/domain/primitives/saga-log.primitives';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';

describe('SagaLogViewModelFactory', () => {
  let factory: SagaLogViewModelFactory;

  beforeEach(() => {
    factory = new SagaLogViewModelFactory();
  });

  describe('create', () => {
    it('should create a SagaLogViewModel from DTO with all fields', () => {
      const now = new Date();

      const dto: ISagaLogCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SagaLogViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.sagaInstanceId).toBe(dto.sagaInstanceId);
      expect(viewModel.sagaStepId).toBe(dto.sagaStepId);
      expect(viewModel.type).toBe(dto.type);
      expect(viewModel.message).toBe(dto.message);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SagaLogViewModel from primitives with all fields', () => {
      const now = new Date();

      const primitives: SagaLogPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(SagaLogViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.sagaInstanceId).toBe(primitives.sagaInstanceId);
      expect(viewModel.sagaStepId).toBe(primitives.sagaStepId);
      expect(viewModel.type).toBe(primitives.type);
      expect(viewModel.message).toBe(primitives.message);
      expect(viewModel.createdAt).toEqual(primitives.createdAt);
      expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
    });
  });

  describe('fromAggregate', () => {
    it('should create a SagaLogViewModel from aggregate with all fields', () => {
      const now = new Date();

      const aggregate = new SagaLogAggregate(
        {
          id: new SagaLogUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          sagaInstanceId: new SagaInstanceUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          sagaStepId: new SagaStepUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
          message: new SagaLogMessageValueObject('Test log message'),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(SagaLogViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.sagaInstanceId).toBe(aggregate.sagaInstanceId.value);
      expect(viewModel.sagaStepId).toBe(aggregate.sagaStepId.value);
      expect(viewModel.type).toBe(aggregate.type.value);
      expect(viewModel.message).toBe(aggregate.message.value);
      expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
    });

    it('should create a SagaLogViewModel from aggregate with different log types', () => {
      const now = new Date();
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const aggregate = new SagaLogAggregate(
          {
            id: new SagaLogUuidValueObject(),
            sagaInstanceId: new SagaInstanceUuidValueObject(),
            sagaStepId: new SagaStepUuidValueObject(),
            type: new SagaLogTypeValueObject(type),
            message: new SagaLogMessageValueObject(`Test message for ${type}`),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        const viewModel = factory.fromAggregate(aggregate);

        expect(viewModel.type).toBe(type);
        expect(viewModel.message).toBe(aggregate.message.value);
      });
    });
  });
});
