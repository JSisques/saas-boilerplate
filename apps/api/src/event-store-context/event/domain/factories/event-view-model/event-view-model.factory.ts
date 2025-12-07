import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { IEventCreateViewModelDto } from '@/event-store-context/event/domain/dtos/view-models/event-create/event-create-view-model.dto';
import { EventPrimitives } from '@/event-store-context/event/domain/primitives/event.primitives';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { Injectable, Logger } from '@nestjs/common';

/**
 * This factory class is used to create a new event store view model.
 */
@Injectable()
export class EventViewModelFactory
  implements
    IReadFactory<
      EventViewModel,
      IEventCreateViewModelDto,
      EventAggregate,
      EventPrimitives
    >
{
  private readonly logger = new Logger(EventViewModelFactory.name);

  /**
   * Creates a new event store view model from a DTO.
   * @param data - The data to create the view model from.
   * @returns The created view model.
   */
  public create(data: IEventCreateViewModelDto): EventViewModel {
    this.logger.log(`Creating event store view model from DTO: ${data}`);
    return new EventViewModel(data);
  }

  /**
   * Creates a new event store view model from a event store primitives.
   *
   * @param primitives - The event store primitive to create the view model from.
   * @returns The event store view model.
   */
  fromPrimitives(primitives: EventPrimitives): EventViewModel {
    return new EventViewModel({
      id: primitives.id,
      eventType: primitives.eventType,
      aggregateType: primitives.aggregateType,
      aggregateId: primitives.aggregateId,
      payload: primitives.payload,
      timestamp: primitives.timestamp,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    });
  }
  /**
   * Creates a new event store view model from a event store domain aggregate.
   *
   * @param aggregate - The event store aggregate to create the view model from.
   * @returns The event store view model.
   */
  fromAggregate(aggregate: EventAggregate): EventViewModel {
    return new EventViewModel({
      id: aggregate.id.value,
      eventType: aggregate.eventType.value,
      aggregateType: aggregate.aggregateType.value,
      aggregateId: aggregate.aggregateId.value,
      payload: aggregate.payload?.value,
      timestamp: aggregate.timestamp.value,
      createdAt: aggregate.createdAt.value,
      updatedAt: aggregate.updatedAt.value,
    });
  }
}
