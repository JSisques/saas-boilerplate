import { EventReplayCommand } from '@/event-store-context/event/application/commands/event-replay/event-replay.command';
import { EventPublishService } from '@/event-store-context/event/application/services/event-publish/event-publish.service';
import { EventAggregate } from '@/event-store-context/event/domain/aggregates/event.aggregate';
import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model.factory';
import {
  EVENT_READ_REPOSITORY_TOKEN,
  EventReadRepository,
} from '@/event-store-context/event/domain/repositories/event-read.repository';
import {
  EVENT_WRITE_REPOSITORY_TOKEN,
  EventWriteRepository,
} from '@/event-store-context/event/domain/repositories/event-write.repository';
import { IBaseService } from '@/shared/application/services/base-service.interface';
import { Pagination, Sort } from '@/shared/domain/entities/criteria';
import { Inject, Injectable, Logger } from '@nestjs/common';

export interface EventReplayFilters {
  id?: string;
  eventType?: string;
  aggregateId?: string;
  aggregateType?: string;
  from?: Date;
  to?: Date;
  pagination?: Pagination;
  sorts?: Sort[];
}

@Injectable()
export class EventReplayService
  implements IBaseService<EventReplayCommand, number>
{
  private readonly logger = new Logger(EventReplayService.name);

  constructor(
    @Inject(EVENT_WRITE_REPOSITORY_TOKEN)
    private readonly eventWriteRepository: EventWriteRepository,
    private readonly eventPublishService: EventPublishService,
    @Inject(EVENT_READ_REPOSITORY_TOKEN)
    private readonly eventReadRepository: EventReadRepository,
    private readonly eventViewModelFactory: EventViewModelFactory,
  ) {}

  async execute(input: EventReplayCommand): Promise<number> {
    this.logger.log(
      `Executing event replay service for events with filters: ${JSON.stringify(input)}`,
    );

    const batchSize = input.batchSize ?? 500;
    let totalEvents = 0;
    let offset = 0;
    let events: EventAggregate[] = [];

    do {
      events = await this.eventWriteRepository.findByCriteria({
        id: input.id?.value,
        eventType: input.eventType ? input.eventType.value : undefined,
        aggregateId: input.aggregateId?.value,
        aggregateType: input.aggregateType?.value,
        from: input.from,
        to: input.to,
        pagination: { page: offset, perPage: batchSize },
      });

      for (const event of events) {
        await this.eventPublishService.execute(event);
        const view = this.eventViewModelFactory.fromAggregate(event);
        await this.eventReadRepository.save(view);

        // TODO: Replace this delay with a better throttling/batching/queuing approach
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 500);
          timeout.unref();
        });
      }

      totalEvents += events.length;
      offset += events.length;
    } while (events.length === batchSize);

    return totalEvents;
  }
}
