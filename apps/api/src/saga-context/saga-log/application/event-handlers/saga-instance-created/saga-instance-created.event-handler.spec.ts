import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceCreatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-created/saga-instance-created.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaInstanceCreatedEventHandler } from './saga-instance-created.event-handler';

describe('SagaInstanceCreatedEventHandler', () => {
  let handler: SagaInstanceCreatedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceCreatedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceCreatedEventHandler>(
      SagaInstanceCreatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a saga log when saga instance is created', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'STARTED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceCreatedEvent',
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
      expect(command.sagaInstanceId.value).toBe(aggregateId);
      expect(command.sagaStepId.value).toBe(aggregateId);
      expect(command.type.value).toBe(SagaLogTypeEnum.INFO);
      expect(command.message.value).toBe(
        `Saga instance "${eventData.name}" created with status "${eventData.status}"`,
      );
    });

    it('should handle event with different status values', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const statuses = ['STARTED', 'RUNNING', 'COMPLETED', 'FAILED'];

      for (const status of statuses) {
        const eventData = {
          id: aggregateId,
          name: `Test Saga Instance ${status}`,
          status: status,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        };

        const event = new SagaInstanceCreatedEvent(
          {
            aggregateId: aggregateId,
            aggregateType: 'SagaInstanceAggregate',
            eventType: 'SagaInstanceCreatedEvent',
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
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'STARTED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceCreatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceCreatedEvent',
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
