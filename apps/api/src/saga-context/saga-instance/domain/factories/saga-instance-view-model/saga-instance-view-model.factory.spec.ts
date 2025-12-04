import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { ISagaInstanceCreateViewModelDto } from '@/saga-context/saga-instance/domain/dtos/view-models/saga-instance-create/saga-instance-create-view-model.dto';
import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import { SagaInstancePrimitives } from '@/saga-context/saga-instance/domain/primitives/saga-instance.primitives';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceEndDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-end-date/saga-instance-end-date.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStartDateValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-start-date/saga-instance-start-date.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';

describe('SagaInstanceViewModelFactory', () => {
  let factory: SagaInstanceViewModelFactory;

  beforeEach(() => {
    factory = new SagaInstanceViewModelFactory();
  });

  describe('create', () => {
    it('should create a SagaInstanceViewModel from DTO with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
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

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SagaInstanceViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.startDate).toEqual(dto.startDate);
      expect(viewModel.endDate).toEqual(dto.endDate);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a SagaInstanceViewModel from DTO with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const dto: ISagaInstanceCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(SagaInstanceViewModel);
      expect(viewModel.startDate).toBeNull();
      expect(viewModel.endDate).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a SagaInstanceViewModel from primitives with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const primitives: SagaInstancePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(SagaInstanceViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.startDate).toEqual(primitives.startDate);
      expect(viewModel.endDate).toEqual(primitives.endDate);
      expect(viewModel.createdAt).toEqual(primitives.createdAt);
      expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
    });

    it('should create a SagaInstanceViewModel from primitives with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const primitives: SagaInstancePrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(SagaInstanceViewModel);
      expect(viewModel.startDate).toBeNull();
      expect(viewModel.endDate).toBeNull();
    });
  });

  describe('fromAggregate', () => {
    it('should create a SagaInstanceViewModel from aggregate with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const aggregate = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SagaInstanceNameValueObject('Order Processing Saga'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.COMPLETED,
          ),
          startDate: new SagaInstanceStartDateValueObject(startDate),
          endDate: new SagaInstanceEndDateValueObject(endDate),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(SagaInstanceViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.startDate).toEqual(aggregate.startDate?.value);
      expect(viewModel.endDate).toEqual(aggregate.endDate?.value);
      expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
    });

    it('should create a SagaInstanceViewModel from aggregate with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');

      const aggregate = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new SagaInstanceNameValueObject('Order Processing Saga'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(SagaInstanceViewModel);
      expect(viewModel.startDate).toBeNull();
      expect(viewModel.endDate).toBeNull();
    });
  });
});
