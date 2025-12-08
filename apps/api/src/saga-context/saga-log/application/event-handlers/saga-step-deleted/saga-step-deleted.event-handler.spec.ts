import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaStepDeletedEvent } from '@/shared/domain/events/saga-context/saga-step/saga-step-deleted/saga-step-deleted.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaStepDeletedEventHandler } from './saga-step-deleted.event-handler';

describe('SagaStepDeletedEventHandler', () => {
  let handler: SagaStepDeletedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaStepDeletedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaStepDeletedEventHandler>(
      SagaStepDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a saga log when saga step is deleted', async () => {
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

      const event = new SagaStepDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepDeletedEvent',
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
        `Saga step "${eventData.name}" deleted`,
      );
    });

    it('should handle event with different step names', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const names = ['Step 1', 'Step 2', 'Step 3'];

      for (const name of names) {
        const eventData = {
          id: aggregateId,
          sagaInstanceId: sagaInstanceId,
          name: name,
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

        const event = new SagaStepDeletedEvent(
          {
            aggregateId: aggregateId,
            aggregateType: 'SagaStepAggregate',
            eventType: 'SagaStepDeletedEvent',
          },
          eventData,
        );

        mockCommandBus.execute.mockResolvedValue(undefined);

        await handler.handle(event);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[
          names.indexOf(name)
        ][0];
        expect(command.message.value).toBe(`Saga step "${name}" deleted`);
      }

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(names.length);
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

      const event = new SagaStepDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaStepAggregate',
          eventType: 'SagaStepDeletedEvent',
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
