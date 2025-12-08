import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-status-changed/saga-step-status-changed.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaStepStatusChangedEventHandler } from './saga-step-status-changed.event-handler';

describe('SagaStepStatusChangedEventHandler', () => {
  let handler: SagaStepStatusChangedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepStatusChangedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaStepStatusChangedEventHandler>(
      SagaStepStatusChangedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create INFO log for normal status changes', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'COMPLETED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: { success: true },
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.INFO);
      expect(command.message.value).toBe(
        `Saga step status changed to "${eventData.status}"`,
      );
    });

    it('should create ERROR log for FAILED status', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'FAILED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: 'Test error message',
        retryCount: 3,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.ERROR);
      expect(command.message.value).toBe(
        `Saga step status changed to "${eventData.status}". Error: ${eventData.errorMessage}`,
      );
    });

    it('should create DEBUG log for RUNNING status', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'RUNNING',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.DEBUG);
      expect(command.message.value).toBe(
        `Saga step status changed to "${eventData.status}"`,
      );
    });

    it('should create DEBUG log for STARTED status', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'STARTED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.DEBUG);
    });

    it('should include error message in log when present', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const errorMessage = 'Something went wrong';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'FAILED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: errorMessage,
        retryCount: 3,
        maxRetries: 3,
        payload: { test: 'data' },
        result: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message.value).toContain(`Error: ${errorMessage}`);
    });

    it('should not include error message in log when not present', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'COMPLETED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: { success: true },
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message.value).not.toContain('Error:');
    });

    it('should handle errors from command bus', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        sagaInstanceId: sagaInstanceId,
        name: 'Test Saga Step',
        order: 1,
        status: 'COMPLETED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: { test: 'data' },
        result: { success: true },
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaStepStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepStatusChangedEvent',
        },
        eventData,
      );

      const error = new Error('Command execution failed');
      mockCommandBus.execute.mockRejectedValue(error);

      await expect(handler.handle(event)).rejects.toThrow(error);
      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
    });
  });
});
