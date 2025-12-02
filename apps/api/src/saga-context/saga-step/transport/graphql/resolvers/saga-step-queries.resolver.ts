import { FindSagaStepsByCriteriaQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-by-criteria/saga-step-find-by-criteria.query';
import { FindSagaStepByIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-by-id/saga-step-find-by-id.query';
import { FindSagaStepViewModelsBySagaInstanceIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-saga-instance-id/saga-step-find-view-model-by-saga-instance-id.query';
import { SagaStepFindByCriteriaRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-find-by-criteria.request.dto';
import { SagaStepFindByIdRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-find-by-id.request.dto';
import { SagaStepFindBySagaInstanceIdRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-find-by-saga-instance-id.request.dto';
import {
  PaginatedSagaStepResultDto,
  SagaStepResponseDto,
} from '@/saga-context/saga-step/transport/graphql/dtos/responses/saga-step.response.dto';
import { SagaStepGraphQLMapper } from '@/saga-context/saga-step/transport/graphql/mappers/saga-step.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
// TODO: Add guards and roles
export class SagaStepQueryResolver {
  private readonly logger = new Logger(SagaStepQueryResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly sagaStepGraphQLMapper: SagaStepGraphQLMapper,
  ) {}

  @Query(() => SagaStepResponseDto, { nullable: true })
  async sagaStepFindById(
    @Args('input') input: SagaStepFindByIdRequestDto,
  ): Promise<SagaStepResponseDto | null> {
    this.logger.log(`Finding saga step by id: ${input.id}`);

    const sagaStep = await this.queryBus.execute(
      new FindSagaStepByIdQuery({ id: input.id }),
    );

    return sagaStep ? this.sagaStepGraphQLMapper.toResponseDto(sagaStep) : null;
  }

  @Query(() => [SagaStepResponseDto])
  async sagaStepFindBySagaInstanceId(
    @Args('input') input: SagaStepFindBySagaInstanceIdRequestDto,
  ): Promise<SagaStepResponseDto[]> {
    this.logger.log(
      `Finding saga steps by saga instance id: ${input.sagaInstanceId}`,
    );

    const sagaSteps = await this.queryBus.execute(
      new FindSagaStepViewModelsBySagaInstanceIdQuery({
        sagaInstanceId: input.sagaInstanceId,
      }),
    );

    return sagaSteps.map((sagaStep) =>
      this.sagaStepGraphQLMapper.toResponseDto(sagaStep),
    );
  }

  @Query(() => PaginatedSagaStepResultDto)
  async sagaStepFindByCriteria(
    @Args('input', { nullable: true })
    input?: SagaStepFindByCriteriaRequestDto,
  ): Promise<PaginatedSagaStepResultDto> {
    this.logger.log(`Finding saga steps by criteria: ${JSON.stringify(input)}`);

    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    const result = await this.queryBus.execute(
      new FindSagaStepsByCriteriaQuery({ criteria }),
    );

    return this.sagaStepGraphQLMapper.toPaginatedResponseDto(result);
  }
}
