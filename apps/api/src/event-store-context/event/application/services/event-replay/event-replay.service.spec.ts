import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventPublishService } from '@/event-store-context/event/application/services/event-publish/event-publish.service';
import { EventReplayService } from '@/event-store-context/event/application/services/event-replay/event-replay.service';
import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model/event-view-model.factory';
import { EventReadRepository } from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EventWriteRepository } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { EventAggregateIdValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-id/event-aggregate-id.vo';
import { EventAggregateTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-aggregate-type/event-aggregate-type.vo';
import { EventPayloadValueObject } from '@/event-store-context/event/domain/value-objects/event-payload/event-payload.vo';
import { EventTimestampValueObject } from '@/event-store-context/event/domain/value-objects/event-timestamp/event-timestamp.vo';
import { EventTypeValueObject } from '@/event-store-context/event/domain/value-objects/event-type/event-type.vo';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { EventUuidValueObject } from '@/shared/domain/value-objects/identifiers/event-uuid/event-uuid.vo';

describe('EventReplayService', () => {
  let service: EventReplayService;
  let mockEventWriteRepository: jest.Mocked<EventWriteRepository>;
  let mockEventPublishService: jest.Mocked<EventPublishService>;
  let mockEventReadRepository: jest.Mocked<EventReadRepository>;
  let mockEventViewModelFactory: jest.Mocked<EventViewModelFactory>;
  let setTimeoutSpy: jest.SpyInstance;

  const createAggregate = (idSuffix: string) => {
    // Generate valid UUIDs by replacing the last character
    const baseId = '123e4567-e89b-12d3-a456-426614174000';
    const baseAggregateId = '223e4567-e89b-12d3-a456-426614174000';
    const id = baseId.slice(0, -1) + idSuffix;
    const aggregateId = baseAggregateId.slice(0, -1) + idSuffix;

    return new EventAggregate(
      {
        id: new EventUuidValueObject(id),
        aggregateId: new EventAggregateIdValueObject(aggregateId),
        aggregateType: new EventAggregateTypeValueObject('UserAggregate'),
        eventType: new EventTypeValueObject('UserUpdatedEvent'),
        payload: new EventPayloadValueObject({ foo: `bar-${idSuffix}` }),
        timestamp: new EventTimestampValueObject(
          new Date(`2024-01-0${idSuffix}T10:00:00Z`),
        ),
      },
      false,
    );
  };

  beforeEach(() => {
    mockEventWriteRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockEventPublishService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EventPublishService>;
    mockEventReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockEventViewModelFactory = {
      fromAggregate: jest.fn(),
      fromPrimitives: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<EventViewModelFactory>;

    service = new EventReplayService(
      mockEventWriteRepository,
      mockEventPublishService,
      mockEventReadRepository,
      mockEventViewModelFactory,
    );

    setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation(((
      callback: (...args: any[]) => void,
    ) => {
      callback();
      return 0 as unknown as NodeJS.Timeout;
    }) as unknown as typeof setTimeout);
  });

  afterEach(() => {
    jest.clearAllMocks();
    setTimeoutSpy.mockRestore();
  });

  it('should replay events in batches and persist read models', async () => {
    const batchSize = 2;
    const command = new EventReplayCommand({
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-31T23:59:59Z'),
      aggregateId: '123e4567-e89b-12d3-a456-426614174001',
      aggregateType: 'UserAggregate',
      eventType: 'UserUpdatedEvent',
      batchSize,
    });

    const aggregate1 = createAggregate('1');
    const aggregate2 = createAggregate('2');
    const aggregate3 = createAggregate('3');
    const viewModel1 = new EventViewModel({
      id: aggregate1.id.value,
      eventType: aggregate1.eventType.value,
      aggregateType: aggregate1.aggregateType.value,
      aggregateId: aggregate1.aggregateId.value,
      payload: aggregate1.payload?.value ?? {},
      timestamp: aggregate1.timestamp.value,
      createdAt: new Date('2024-01-02T12:00:00Z'),
      updatedAt: new Date('2024-01-02T12:00:00Z'),
    });
    const viewModel2 = new EventViewModel({
      id: aggregate2.id.value,
      eventType: aggregate2.eventType.value,
      aggregateType: aggregate2.aggregateType.value,
      aggregateId: aggregate2.aggregateId.value,
      payload: aggregate2.payload?.value ?? {},
      timestamp: aggregate2.timestamp.value,
      createdAt: new Date('2024-01-03T12:00:00Z'),
      updatedAt: new Date('2024-01-03T12:00:00Z'),
    });
    const viewModel3 = new EventViewModel({
      id: aggregate3.id.value,
      eventType: aggregate3.eventType.value,
      aggregateType: aggregate3.aggregateType.value,
      aggregateId: aggregate3.aggregateId.value,
      payload: aggregate3.payload?.value ?? {},
      timestamp: aggregate3.timestamp.value,
      createdAt: new Date('2024-01-04T12:00:00Z'),
      updatedAt: new Date('2024-01-04T12:00:00Z'),
    });

    mockEventWriteRepository.findByCriteria
      .mockResolvedValueOnce([aggregate1, aggregate2])
      .mockResolvedValueOnce([aggregate3])
      .mockResolvedValue([]);

    mockEventViewModelFactory.fromAggregate
      .mockReturnValueOnce(viewModel1)
      .mockReturnValueOnce(viewModel2)
      .mockReturnValueOnce(viewModel3);

    const total = await service.execute(command);

    expect(total).toBe(3);
    expect(mockEventWriteRepository.findByCriteria).toHaveBeenCalledTimes(2);
    expect(mockEventWriteRepository.findByCriteria).toHaveBeenNthCalledWith(1, {
      id: command.id?.value,
      eventType: command.eventType?.value,
      aggregateId: command.aggregateId?.value,
      aggregateType: command.aggregateType?.value,
      from: command.from,
      to: command.to,
      pagination: { page: 0, perPage: batchSize },
    });
    expect(mockEventWriteRepository.findByCriteria).toHaveBeenNthCalledWith(2, {
      id: command.id?.value,
      eventType: command.eventType?.value,
      aggregateId: command.aggregateId?.value,
      aggregateType: command.aggregateType?.value,
      from: command.from,
      to: command.to,
      pagination: { page: 2, perPage: batchSize },
    });
    expect(mockEventPublishService.execute).toHaveBeenCalledTimes(3);
    expect(mockEventPublishService.execute).toHaveBeenNthCalledWith(
      1,
      aggregate1,
    );
    expect(mockEventPublishService.execute).toHaveBeenNthCalledWith(
      2,
      aggregate2,
    );
    expect(mockEventPublishService.execute).toHaveBeenNthCalledWith(
      3,
      aggregate3,
    );
    expect(mockEventViewModelFactory.fromAggregate).toHaveBeenCalledTimes(3);
    expect(mockEventReadRepository.save).toHaveBeenCalledTimes(3);
    expect(mockEventReadRepository.save).toHaveBeenNthCalledWith(1, viewModel1);
    expect(mockEventReadRepository.save).toHaveBeenNthCalledWith(2, viewModel2);
    expect(mockEventReadRepository.save).toHaveBeenNthCalledWith(3, viewModel3);
  });

  it('should use default batch size when not provided', async () => {
    const command = new EventReplayCommand({
      from: new Date('2024-01-01T00:00:00Z'),
      to: new Date('2024-01-02T00:00:00Z'),
    });
    const aggregate = createAggregate('4');
    const viewModel = new EventViewModel({
      id: aggregate.id.value,
      eventType: aggregate.eventType.value,
      aggregateType: aggregate.aggregateType.value,
      aggregateId: aggregate.aggregateId.value,
      payload: aggregate.payload?.value ?? {},
      timestamp: aggregate.timestamp.value,
      createdAt: new Date('2024-01-05T12:00:00Z'),
      updatedAt: new Date('2024-01-05T12:00:00Z'),
    });

    mockEventWriteRepository.findByCriteria
      .mockResolvedValueOnce([aggregate])
      .mockResolvedValue([]);
    mockEventViewModelFactory.fromAggregate.mockReturnValue(viewModel);

    const total = await service.execute(command);

    expect(total).toBe(1);
    expect(mockEventWriteRepository.findByCriteria).toHaveBeenCalledWith({
      id: command.id?.value,
      eventType: command.eventType?.value,
      aggregateId: command.aggregateId?.value,
      aggregateType: command.aggregateType?.value,
      from: command.from,
      to: command.to,
      pagination: { page: 0, perPage: 500 },
    });
  });
});
