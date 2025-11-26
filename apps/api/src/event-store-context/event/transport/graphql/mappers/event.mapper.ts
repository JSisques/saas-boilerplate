import { EventViewModel } from '@/event-store-context/event/domain/view-models/event-store.view-model';
import {
  EventResponseDto,
  PaginatedEventResultDto,
} from '@/event-store-context/event/transport/graphql/dtos/responses/event.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventGraphQLMapper {
  toResponseDto(event: EventViewModel): EventResponseDto {
    return {
      id: event.id,
      eventType: event.eventType,
      aggregateType: event.aggregateType,
      aggregateId: event.aggregateId,
      payload: event.payload ? JSON.stringify(event.payload) : null,
      timestamp: event.timestamp,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<EventViewModel>,
  ): PaginatedEventResultDto {
    return {
      items: paginatedResult.items.map((event) => this.toResponseDto(event)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
