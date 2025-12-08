import { SagaLogCreateCommand } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceUpdatedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-updated/saga-instance-updated.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaInstanceUpdatedEventHandler } from './saga-instance-updated.event-handler';

describe('SagaInstanceUpdatedEventHandler', () => {
  let handler: SagaInstanceUpdatedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceUpdatedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceUpdatedEventHandler>(
      SagaInstanceUpdatedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a saga log when saga instance is updated', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Saga Instance',
        status: 'RUNNING',
      };

      const event = new SagaInstanceUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceUpdatedEvent',
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
      expect(command.message.value).toContain('Saga instance updated');
      expect(command.message.value).toContain('Changed fields:');
      expect(command.message.value).toContain('name');
      expect(command.message.value).toContain('status');
    });

    it('should handle event with partial update data', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        status: 'COMPLETED',
      };

      const event = new SagaInstanceUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceUpdatedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message.value).toContain('status');
      expect(command.message.value).not.toContain('name');
    });

    it('should filter out undefined fields from changed fields', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Name',
        status: undefined,
        startDate: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceUpdatedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.message.value).toContain('name');
      expect(command.message.value).toContain('startDate');
      expect(command.message.value).not.toContain('status');
    });

    it('should handle errors from command bus', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        name: 'Updated Saga Instance',
      };

      const event = new SagaInstanceUpdatedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceUpdatedEvent',
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
