import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepCreatedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-created/saga-step-created.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaStepCreatedEventHandler } from './saga-step-created.event-handler';

describe('SagaStepCreatedEventHandler', () => {
  let handler: SagaStepCreatedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepCreatedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaStepCreatedEventHandler>(
      SagaStepCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a saga log when saga step is created', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
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
      };

      const event = new SagaStepCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepCreatedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        expect.any(SagaLogCreateCommand),
      );

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command).toBeInstanceOf(SagaLogCreateCommand);
      expect(command.sagaInstanceId.value).toBe(sagaInstanceId);
      expect(command.sagaStepId.value).toBe(aggregateId);
      expect(command.type.value).toBe(SagaLogTypeEnum.INFO);
      expect(command.message.value).toBe(
        `Saga step "${eventData.name}" created with status "${eventData.status}"`,
      );
    });

    it('should handle event with different status values', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const statuses = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'];

      for (const status of statuses) {
        const eventData = {
          id: aggregateId,
          sagaInstanceId: sagaInstanceId,
          name: `Test Saga Step ${status}`,
          order: 1,
          status: status,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: { test: 'data' },
          result: null,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        };

        const event = new SagaStepCreatedEvent(
          {
            aggregateId: aggregateId,
            aggregateType: 'SagaStepAggregate',
            eventType: 'SagaStepCreatedEvent',
          },
          eventData,
        );

        mockCommandBus.execute.mockResolvedValue(undefined);

        await handler.handle(event);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[
          statuses.indexOf(status)
        ][0];
        expect(command.message.value).toContain(eventData.name);
        expect(command.message.value).toContain(status);
      }

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(statuses.length);
    });

    it('should handle errors from command bus', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const eventData = {
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
      };

      const event = new SagaStepCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepCreatedEvent',
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
