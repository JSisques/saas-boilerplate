import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { UserRoleEnum } from '@/prisma/master/client';
import { FindSagaLogsByCriteriaQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.query';
import { FindSagaLogViewModelByIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.query';
import { FindSagaLogViewModelsBySagaInstanceIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.query';
import { FindSagaLogViewModelsBySagaStepIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.query';
import { SagaLogFindByCriteriaRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-criteria.request.dto';
import { SagaLogFindByIdRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-id.request.dto';
import { SagaLogFindBySagaInstanceIdRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-saga-instance-id.request.dto';
import { SagaLogFindBySagaStepIdRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-saga-step-id.request.dto';
import {
  PaginatedSagaLogResultDto,
  SagaLogResponseDto,
} from '@/saga-context/saga-log/transport/graphql/dtos/responses/saga-log.response.dto';
import { SagaLogGraphQLMapper } from '@/saga-context/saga-log/transport/graphql/mappers/saga-log.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class SagaLogQueryResolver {
  private readonly logger = new Logger(SagaLogQueryResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly sagaLogGraphQLMapper: SagaLogGraphQLMapper,
  ) {}

  @Query(() => SagaLogResponseDto, { nullable: true })
  async sagaLogFindById(
    @Args('input') input: SagaLogFindByIdRequestDto,
  ): Promise<SagaLogResponseDto | null> {
    this.logger.log(`Finding saga log by id: ${input.id}`);

    const sagaLog = await this.queryBus.execute(
      new FindSagaLogViewModelByIdQuery({ id: input.id }),
    );

    return sagaLog ? this.sagaLogGraphQLMapper.toResponseDto(sagaLog) : null;
  }

  @Query(() => [SagaLogResponseDto])
  async sagaLogFindBySagaInstanceId(
    @Args('input') input: SagaLogFindBySagaInstanceIdRequestDto,
  ): Promise<SagaLogResponseDto[]> {
    this.logger.log(
      `Finding saga logs by saga instance id: ${input.sagaInstanceId}`,
    );

    const sagaLogs = await this.queryBus.execute(
      new FindSagaLogViewModelsBySagaInstanceIdQuery({
        sagaInstanceId: input.sagaInstanceId,
      }),
    );

    return sagaLogs.map((sagaLog) =>
      this.sagaLogGraphQLMapper.toResponseDto(sagaLog),
    );
  }

  @Query(() => [SagaLogResponseDto])
  async sagaLogFindBySagaStepId(
    @Args('input') input: SagaLogFindBySagaStepIdRequestDto,
  ): Promise<SagaLogResponseDto[]> {
    this.logger.log(`Finding saga logs by saga step id: ${input.sagaStepId}`);

    const sagaLogs = await this.queryBus.execute(
      new FindSagaLogViewModelsBySagaStepIdQuery({
        sagaStepId: input.sagaStepId,
      }),
    );

    return sagaLogs.map((sagaLog) =>
      this.sagaLogGraphQLMapper.toResponseDto(sagaLog),
    );
  }

  @Query(() => PaginatedSagaLogResultDto)
  async sagaLogFindByCriteria(
    @Args('input', { nullable: true })
    input?: SagaLogFindByCriteriaRequestDto,
  ): Promise<PaginatedSagaLogResultDto> {
    this.logger.log(`Finding saga logs by criteria: ${JSON.stringify(input)}`);

    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    const result = await this.queryBus.execute(
      new FindSagaLogsByCriteriaQuery({ criteria }),
    );

    return this.sagaLogGraphQLMapper.toPaginatedResponseDto(result);
  }
}
