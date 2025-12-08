import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { FindSagaStepViewModelByIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.query';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepUpdatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-updated/saga-step-updated.event';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaStepUpdatedEventHandler } from './saga-step-updated.event-handler';

describe('SagaStepUpdatedEventHandler', () => {
  let handler: SagaStepUpdatedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockQueryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepUpdatedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    handler = module.get<SagaStepUpdatedEventHandler>(
      SagaStepUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a saga log when saga step is updated', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Saga Step',
        status: 'RUNNING',
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const sagaStepViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'PENDING',
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockQueryBus.execute.mockResolvedValue(sagaStepViewModel);
      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepViewModelByIdQuery),
      );
      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaLogCreateCommand),
      );

      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaStepViewModelByIdQuery);
      expect(query.id.value).toBe(aggregateId);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaLogCreateCommand);
      expect(command.sagaInstanceId.value).toBe(sagaInstanceId);
      expect(command.sagaStepId.value).toBe(aggregateId);
      expect(command.type.value).toBe(SagaLogTypeEnum.INFO);
      expect(command.message.value).toContain('Saga step updated');
      expect(command.message.value).toContain('Changed fields:');
      expect(command.message.value).toContain('name');
      expect(command.message.value).toContain('status');
    });

    it('should handle event with partial update data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        status: 'COMPLETED',
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const sagaStepViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'PENDING',
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockQueryBus.execute.mockResolvedValue(sagaStepViewModel);
      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message.value).toContain('status');
      expect(command.message.value).not.toContain('name');
    });

    it('should filter out undefined fields from changed fields', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Name',
        status: undefined,
        order: 2,
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const sagaStepViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'PENDING',
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockQueryBus.execute.mockResolvedValue(sagaStepViewModel);
      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message.value).toContain('name');
      expect(command.message.value).toContain('order');
      expect(command.message.value).not.toContain('status');
    });

    it('should handle errors from query bus', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Saga Step',
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const error = new Error('Query execution failed');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      expect(mockCommandBus.execute).not.toHaveBeenCalled();
    });

    it('should handle errors from command bus', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Saga Step',
      };

      const event = new SagaStepUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepUpdatedEvent',
        },
        eventData,
      );

      const sagaStepViewModel = new SagaStepViewModel({
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'PENDING',
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockQueryBus.execute.mockResolvedValue(sagaStepViewModel);
      const error = new Error('Command execution failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
    });
  });
});
