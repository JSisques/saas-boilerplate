import { FindEventsByCriteriaQuery } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command';
import {
  EVENT_READ_REPOSITORY_TOKEN,
  EventReadRepository,
} from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindEventsByCriteriaQuery)
export class FindEventsByCriteriaQueryHandler
  implements IQueryHandler<FindEventsByCriteriaQuery>
{
  private readonly logger = new Logger(FindEventsByCriteriaQueryHandler.name);

  constructor(
    @Inject(EVENT_READ_REPOSITORY_TOKEN)
    private readonly eventReadRepository: EventReadRepository,
  ) {}

  /**
   * Executes the FindEventsByCriteriaQuery query.
   *
   * @param query - The FindEventsByCriteriaQuery query to execute.
   * @returns The PaginatedResult of EventViewModels.
   */
  async execute(
    query: FindEventsByCriteriaQuery,
  ): Promise<PaginatedResult<EventViewModel>> {
    this.logger.log(
      `Executing find events by criteria query: ${query.criteria.toString()}`,
    );

    return this.eventReadRepository.findByCriteria(query.criteria);
  }
}
