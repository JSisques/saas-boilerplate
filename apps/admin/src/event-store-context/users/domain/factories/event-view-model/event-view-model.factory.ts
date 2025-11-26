import { EventAggregate } from '@/event-store-context/users/domain/aggregates/event.aggregate';
import { IEventCreateViewModelDto } from '@/event-store-context/users/domain/dtos/view-models/event-create/event-create-view-model.dto';
import { EventPrimitives } from '@/event-store-context/users/domain/primitives/event.primitives';
import { EventViewModel } from '@/event-store-context/users/domain/view-models/event.view-model';
import { IReadFactory } from '@repo/shared/domain/interfaces/read-factory.interface';

/**
 * This factory class is used to create a new event view model.
 */
export class EventViewModelFactory
  implements
    IReadFactory<
      EventViewModel,
      IEventCreateViewModelDto,
      EventAggregate,
      EventPrimitives
    >
{
  /**
   * Creates a new event view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IEventCreateViewModelDto): EventViewModel {
    return new EventViewModel(data);
  }

  /**
   * Creates a new event view model from a event primitive.
   *
   * @param eventPrimitives - The event primitive to create the view model from.
   * @returns The event view model.
   */
  fromPrimitives(eventPrimitives: EventPrimitives): EventViewModel {
    const now = new Date();

    return new EventViewModel({
      id: eventPrimitives.id,
      eventType: eventPrimitives.eventType,
      aggregateType: eventPrimitives.aggregateType,
      aggregateId: eventPrimitives.aggregateId,
      payload: eventPrimitives.payload ?? {},
      timestamp: eventPrimitives.timestamp,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Creates a new event view model from a event aggregate.
   *
   * @param eventAggregate - The event aggregate to create the view model from.
   * @returns The event view model.
   */
  fromAggregate(eventAggregate: EventAggregate): EventViewModel {
    const now = new Date();

    return new EventViewModel({
      id: eventAggregate.id.value,
      eventType: eventAggregate.eventType.value,
      aggregateType: eventAggregate.aggregateType.value,
      aggregateId: eventAggregate.aggregateId.value,
      payload: eventAggregate.payload?.value ?? {},
      timestamp: eventAggregate.timestamp.value,
      createdAt: now,
      updatedAt: now,
    });
  }
}
