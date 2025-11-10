import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventReplayCommandHandler } from '@/event-store-context/event/application/commands/event-replay/event-replay.command-handler';
import { EventReplayService } from '@/event-store-context/event/application/services/event-replay/event-replay.service';

describe('EventReplayCommandHandler', () => {
  let handler: EventReplayCommandHandler;
  let mockEventReplayService: jest.Mocked<EventReplayService>;

  beforeEach(() => {
    mockEventReplayService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EventReplayService>;

    handler = new EventReplayCommandHandler(mockEventReplayService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate execution to EventReplayService and return count', async () => {
    const command = new EventReplayCommand({
      id: '123e4567-e89b-12d3-a456-426614174000',
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      aggregateType: 'UserAggregate',
      eventType: 'UserCreatedEvent',
      batchSize: 200,
    });

    mockEventReplayService.execute.mockResolvedValue(5);

    const result = await handler.execute(command);

    expect(result).toBe(5);
    expect(mockEventReplayService.execute).toHaveBeenCalledWith({
      id: command.id,
      eventType: command.eventType,
      aggregateId: command.aggregateId,
      aggregateType: command.aggregateType,
      from: command.from,
      to: command.to,
      batchSize: command.batchSize,
    });
    expect(mockEventReplayService.execute).toHaveBeenCalledTimes(1);
  });

  it('should propagate errors from EventReplayService', async () => {
    const command = new EventReplayCommand({
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
    });
    const error = new Error('Replay failed');

    mockEventReplayService.execute.mockRejectedValue(error);

    await expect(handler.execute(command)).rejects.toThrow(error);
    expect(mockEventReplayService.execute).toHaveBeenCalledTimes(1);
  });
});
