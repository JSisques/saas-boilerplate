import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles.guard';
import { FindSubscriptionsByCriteriaQuery } from '@/billing-context/subscription/application/queries/subscription-find-by-criteria/subscription-find-by-criteria.query';
import { FindSubscriptionViewModelByIdQuery } from '@/billing-context/subscription/application/queries/subscription-find-view-model-by-id/subscription-find-view-model-by-id.query';
import { FindSubscriptionViewModelByTenantIdQuery } from '@/billing-context/subscription/application/queries/subscription-find-view-model-by-tenant-id copy/subscription-find-view-model-by-tenant-id.query';
import { SubscriptionFindByCriteriaRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-find-by-criteria.request.dto';
import { SubscriptionFindByIdRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-find-by-id.request.dto';
import { SubscriptionFindByTenantIdRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-find-by-tenant-id.request.dto';
import {
  PaginatedSubscriptionResultDto,
  SubscriptionResponseDto,
} from '@/billing-context/subscription/transport/graphql/dtos/responses/subscription.response.dto';
import { SubscriptionGraphQLMapper } from '@/billing-context/subscription/transport/graphql/mappers/subscription.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoleEnum } from '@prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.USER) // TODO: Check, only can get subscriptions for owner of the tenant
export class SubscriptionQueryResolver {
  private readonly logger = new Logger(SubscriptionQueryResolver.name);
  constructor(
    private readonly queryBus: QueryBus,
    private readonly subscriptionGraphQLMapper: SubscriptionGraphQLMapper,
  ) {}

  /**
   * Finds subscriptions that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param {SubscriptionFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
   * @returns {Promise<PaginatedSubscriptionResultDto>} A promise resolving to paginated results of subscriptions matching the provided criteria.
   */
  @Query(() => PaginatedSubscriptionResultDto)
  async subscriptionFindByCriteria(
    @Args('input', { nullable: true })
    input?: SubscriptionFindByCriteriaRequestDto,
  ): Promise<PaginatedSubscriptionResultDto> {
    this.logger.log(
      `Finding subscriptions with input: ${JSON.stringify(input)}`,
    );

    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindSubscriptionsByCriteriaQuery({ criteria }),
    );

    // 03: Convert to response DTO
    return this.subscriptionGraphQLMapper.toPaginatedResponseDto(result);
  }

  /**
   * Finds a subscription by its ID.
   *
   * @param {SubscriptionFindByIdRequestDto} input - The information containing the ID of the subscription to be found.
   * @returns {Promise<SubscriptionResponseDto>} The subscription matching the provided ID.
   */
  @Query(() => SubscriptionResponseDto)
  async subscriptionFindById(
    @Args('input') input: SubscriptionFindByIdRequestDto,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(
      `Finding subscription by id with input: ${JSON.stringify(input)}`,
    );

    // 01: Execute query
    const result = await this.queryBus.execute(
      new FindSubscriptionViewModelByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return this.subscriptionGraphQLMapper.toResponseDto(result);
  }

  /**
   * Finds a subscription by its tenant ID.
   *
   * @param {SubscriptionFindByTenantIdRequestDto} input - The information containing the tenant ID of the subscription to be found.
   * @returns {Promise<SubscriptionResponseDto>} The subscription matching the provided tenant ID.
   */
  @Query(() => SubscriptionResponseDto)
  async subscriptionFindByTenantId(
    @Args('input') input: SubscriptionFindByTenantIdRequestDto,
  ): Promise<SubscriptionResponseDto> {
    this.logger.log(
      `Finding subscription by tenant id with input: ${JSON.stringify(input)}`,
    );

    // 01: Execute query
    const result = await this.queryBus.execute(
      new FindSubscriptionViewModelByTenantIdQuery({
        tenantId: input.tenantId,
      }),
    );

    // 02: Convert to response DTO
    return this.subscriptionGraphQLMapper.toResponseDto(result);
  }
}
