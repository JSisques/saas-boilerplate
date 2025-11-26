import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model/event-view-model.factory';
import {
  EVENT_READ_REPOSITORY_TOKEN,
  EventReadRepository,
} from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EventCreatedEvent } from '@/shared/domain/events/event-store/event-created/event-created.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(EventCreatedEvent)
export class EventCreatedEventHandler
  implements IEventHandler<EventCreatedEvent>
{
  private readonly logger = new Logger(EventCreatedEventHandler.name);

  constructor(
    @Inject(EVENT_READ_REPOSITORY_TOKEN)
    private readonly eventReadRepository: EventReadRepository,
    private readonly eventViewModelFactory: EventViewModelFactory,
  ) {}

  /**
   * Handles the EventCreatedEvent by transforming the event data into a view model
   * and persisting it in the read database. This method ensures that the read database
   * is synchronized and updated with the changes produced in the domain, allowing efficient
   * and consistent queries for read operations.
   *
   * @param event - The EventCreatedEvent containing the event data to be reflected in the read model.
   */
  async handle(event: EventCreatedEvent) {
    this.logger.log(`Handling event created event: ${event.aggregateId}`);

    // 01: Create the event view model
    const newEventViewModel = this.eventViewModelFactory.fromPrimitives(
      event.data,
    );

    // 02: Save the event view model
    await this.eventReadRepository.save(newEventViewModel);
  }
}
