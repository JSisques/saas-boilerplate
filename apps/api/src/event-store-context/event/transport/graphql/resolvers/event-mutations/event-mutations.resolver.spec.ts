import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventReplayRequestDto } from '@/event-store-context/event/transport/graphql/dtos/requests/event-replay.request.dto';
import { EventMutationResolver } from '@/event-store-context/event/transport/graphql/resolvers/event-mutations/event-mutations.resolver';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { CommandBus } from '@nestjs/cqrs';

describe('EventMutationResolver', () => {
  let resolver: EventMutationResolver;
  let mockCommandBus: jest.Mocked<CommandBus>;
  let mockMutationResponseMapper: jest.Mocked<MutationResponseGraphQLMapper>;

  beforeEach(() => {
    mockCommandBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    mockMutationResponseMapper = {
      toResponseDto: jest.fn(),
    } as unknown as jest.Mocked<MutationResponseGraphQLMapper>;

    resolver = new EventMutationResolver(
      mockCommandBus,
      mockMutationResponseMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute replay command and return mapped response', async () => {
    const input: EventReplayRequestDto = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      eventType: 'UserCreatedEvent',
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      aggregateType: 'UserAggregate',
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
      batchSize: 100,
    };
    const commandResult = 5;
    const responseDto = { success: true, message: 'ok' };

    mockCommandBus.execute.mockResolvedValue(commandResult);
    mockMutationResponseMapper.toResponseDto.mockReturnValue(
      responseDto as any,
    );

    const result = await resolver.eventReplay(input);

    expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
    const executedCommand = mockCommandBus.execute.mock.calls[0][0];
    expect(executedCommand).toBeInstanceOf(EventReplayCommand);
    expect(mockMutationResponseMapper.toResponseDto).toHaveBeenCalledWith({
      success: true,
      message: `Replayed ${commandResult} event(s)`,
    });
    expect(result).toBe(responseDto);
  });
});
