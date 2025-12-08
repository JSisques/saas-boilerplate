import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaInstanceStatusChangedEvent } from '@/shared/domain/events/saga-context/saga-instance/saga-instance-status-changed/saga-instance-status-changed.event';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { SagaInstanceStatusChangedEventHandler } from './saga-instance-status-changed.event-handler';

describe('SagaInstanceStatusChangedEventHandler', () => {
  let handler: SagaInstanceStatusChangedEventHandler;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    const module = await Test.createTestingModule({
      providers: [
        SagaInstanceStatusChangedEventHandler,
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<SagaInstanceStatusChangedEventHandler>(
      SagaInstanceStatusChangedEventHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create INFO log for normal status changes', async () => {
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

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.INFO);
      expect(command.message.value).toBe(
        `Saga instance status changed to "${eventData.status}"`,
      );
    });

    it('should create ERROR log for FAILED status', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'FAILED',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.ERROR);
      expect(command.message.value).toBe(
        `Saga instance status changed to "${eventData.status}"`,
      );
    });

    it('should create ERROR log for COMPENSATING status', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'COMPENSATING',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.ERROR);
    });

    it('should create DEBUG log for RUNNING status', async () => {
      const aggregateId = '123e4567-e89b-12d3-a456-426614174000';
      const eventData = {
        id: aggregateId,
        name: 'Test Saga Instance',
        status: 'RUNNING',
        startDate: new Date('2024-01-01T10:00:00Z'),
        endDate: new Date('2024-01-01T11:00:00Z'),
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.DEBUG);
    });

    it('should create DEBUG log for STARTED status', async () => {
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

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
        },
        eventData,
      );

      mockCommandBus.execute.mockResolvedValue(undefined);

      await handler.handle(event);

      const command = (mockCommandBus.execute as jest.Mock).mock.calls[0][0];
      expect(command.type.value).toBe(SagaLogTypeEnum.DEBUG);
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

      const event = new SagaInstanceStatusChangedEvent(
        {
          aggregateId: aggregateId,
          aggregateType: 'SagaInstanceAggregate',
          eventType: 'SagaInstanceStatusChangedEvent',
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
