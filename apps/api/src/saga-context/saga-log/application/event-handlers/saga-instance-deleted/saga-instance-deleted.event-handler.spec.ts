import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceDeletedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-deleted/saga-instance-deleted.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaInstanceDeletedEventHandler } from './saga-instance-deleted.event-handler';

describe('SagaInstanceDeletedEventHandler', () => {
  let handler: SagaInstanceDeletedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceDeletedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceDeletedEventHandler>(
      SagaInstanceDeletedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a saga log when saga instance is deleted', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'COMPLETED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceDeletedEvent',
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
        `Saga instance "${eventData.name}" deleted`,
      );
    });

    it('should handle event with different instance names', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const names = ['Instance 1', 'Instance 2', 'Instance 3'];

      for (const name of names) {
        const eventData = {
          id: aggregateId,
          name: name,
          status: 'COMPLETED',
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        };

        const event = new SagaInstanceDeletedEvent(
          {
            aggregateId: aggregateId,
            aggregateType: 'SagaInstanceAggregate',
            eventType: 'SagaInstanceDeletedEvent',
          },
          eventData,
        );

        mockCommandBus.execute.mockResolvedValue(undefined);

        await handler.handle(event);

        const command = (mockCommandBus.execute as jest.Mock).mock.calls[
          names.indexOf(name)
        ][0];
        expect(command.message.value).toBe(`Saga instance "${name}" deleted`);
      }

      expect(mockCommandBus.execute).toHaveBeenCalledTimes(names.length);
    });

    it('should handle errors from command bus', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'COMPLETED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceDeletedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceDeletedEvent',
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
