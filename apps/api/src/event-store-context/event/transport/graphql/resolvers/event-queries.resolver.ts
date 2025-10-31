import { FindEventsByCriteriaQuery } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command';
import { EventFindByCriteriaRequestDto } from '@/event-store-context/event/transport/graphql/dtos/requests/event-find-by-criteria.request.dto';
import { PaginatedEventResultDto } from '@/event-store-context/event/transport/graphql/dtos/responses/event.response.dto';
import { EventGraphQLMapper } from '@/event-store-context/event/transport/graphql/mappers/event.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class EventQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventGraphQLMapper: EventGraphQLMapper,
  ) {}

  @Query(() => PaginatedEventResultDto)
  async eventsFindByCriteria(
    @Args('input', { nullable: true }) input?: EventFindByCriteriaRequestDto,
  ): Promise<PaginatedEventResultDto> {
    // 01: Execute query
    const result = await this.queryBus.execute(
      new FindEventsByCriteriaQuery({
        criteria: new Criteria(input?.filters, input?.sorts, input?.pagination),
      }),
    );

    // 02: Convert to response DTO
    return this.eventGraphQLMapper.toPaginatedResponseDto(result);
  }
}
