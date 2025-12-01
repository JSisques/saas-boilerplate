import { FindSagaInstancesByCriteriaQuery } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query';
import { FindSagaInstanceByIdQuery } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-id/saga-instance-find-by-id.query';
import { SagaInstanceFindByCriteriaRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-find-by-criteria.request.dto';
import { SagaInstanceFindByIdRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-find-by-id.request.dto';
import {
  PaginatedSagaInstanceResultDto,
  SagaInstanceResponseDto,
} from '@/saga-context/saga-instance/transport/graphql/dtos/responses/saga-instance.response.dto';
import { SagaInstanceGraphQLMapper } from '@/saga-context/saga-instance/transport/graphql/mappers/saga-instance.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
// TODO: Add guards and roles
export class SagaInstanceQueryResolver {
  private readonly logger = new Logger(SagaInstanceQueryResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly sagaInstanceGraphQLMapper: SagaInstanceGraphQLMapper,
  ) {}

  @Query(() => SagaInstanceResponseDto, { nullable: true })
  async sagaInstanceFindById(
    @Args('input') input: SagaInstanceFindByIdRequestDto,
  ): Promise<SagaInstanceResponseDto | null> {
    this.logger.log(`Finding saga instance by id: ${input.id}`);

    const sagaInstance = await this.queryBus.execute(
      new FindSagaInstanceByIdQuery({ id: input.id }),
    );

    return sagaInstance
      ? this.sagaInstanceGraphQLMapper.toResponseDto(sagaInstance)
      : null;
  }

  @Query(() => PaginatedSagaInstanceResultDto)
  async sagaInstanceFindByCriteria(
    @Args('input', { nullable: true })
    input?: SagaInstanceFindByCriteriaRequestDto,
  ): Promise<PaginatedSagaInstanceResultDto> {
    this.logger.log(
      `Finding saga instances by criteria: ${JSON.stringify(input)}`,
    );

    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    const result = await this.queryBus.execute(
      new FindSagaInstancesByCriteriaQuery({ criteria }),
    );

    return this.sagaInstanceGraphQLMapper.toPaginatedResponseDto(result);
  }
}
