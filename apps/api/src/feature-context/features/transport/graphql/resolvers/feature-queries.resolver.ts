import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles/roles.guard';
import { FeatureViewModelFindByIdQuery } from '@/feature-context/features/application/queries/feature-view-model-find-by-id/feature-view-model-find-by-id.query';
import { FindFeaturesByCriteriaQuery } from '@/feature-context/features/application/queries/find-features-by-criteria/find-features-by-criteria.query';
import { FeatureFindByCriteriaRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/feature-find-by-criteria.request.dto';
import { FeatureFindByIdRequestDto } from '@/feature-context/features/transport/graphql/dtos/requests/feature-find-by-id.request.dto';
import {
  FeatureResponseDto,
  PaginatedFeatureResultDto,
} from '@/feature-context/features/transport/graphql/dtos/responses/feature.response.dto';
import { FeatureGraphQLMapper } from '@/feature-context/features/transport/graphql/mappers/feature.mapper';
import { UserRoleEnum } from '@/prisma/master/client';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class FeatureQueriesResolver {
  private readonly logger = new Logger(FeatureQueriesResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly featureGraphQLMapper: FeatureGraphQLMapper,
  ) {}

  @Query(() => PaginatedFeatureResultDto)
  async featuresFindByCriteria(
    @Args('input', { nullable: true })
    input?: FeatureFindByCriteriaRequestDto,
  ): Promise<PaginatedFeatureResultDto> {
    this.logger.log(`Finding features by criteria: ${JSON.stringify(input)}`);

    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindFeaturesByCriteriaQuery(criteria),
    );

    // 03: Convert to response DTO
    return this.featureGraphQLMapper.toPaginatedResponseDto(result);
  }

  @Query(() => FeatureResponseDto)
  async featureFindById(
    @Args('input') input: FeatureFindByIdRequestDto,
  ): Promise<FeatureResponseDto> {
    this.logger.log(`Finding feature by id: ${input.id}`);

    // 01: Execute query
    const result = await this.queryBus.execute(
      new FeatureViewModelFindByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return this.featureGraphQLMapper.toResponseDto(result);
  }
}
