import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles.guard';
import { FindSubscriptionPlansByCriteriaQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-by-criteria/subscription-plan-find-by-criteria.query';
import { FindSubscriptionPlanViewModelByIdQuery } from '@/billing-context/subscription-plan/application/queries/subscription-plan-find-view-model-by-id/subscription-plan-find-view-model-by-id.query';
import { SubscriptionPlanFindByCriteriaRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-find-by-criteria.request.dto';
import { SubscriptionPlanFindByIdRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-find-by-id.request.dto';
import {
  PaginatedSubscriptionPlanResultDto,
  SubscriptionPlanResponseDto,
} from '@/billing-context/subscription-plan/transport/graphql/dtos/responses/subscription-plan.response.dto';
import { SubscriptionPlanGraphQLMapper } from '@/billing-context/subscription-plan/transport/graphql/mappers/subscription-plan.mapper';
import { UserRoleEnum } from '@/prisma/master/client';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Logger, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class SubscriptionPlanQueryResolver {
  private readonly logger = new Logger(SubscriptionPlanQueryResolver.name);
  constructor(
    private readonly queryBus: QueryBus,
    private readonly subscriptionPlanGraphQLMapper: SubscriptionPlanGraphQLMapper,
  ) {}

  /**
   * Finds subscription plans that satisfy specified criteria such as filtering, sorting, and pagination.
   *
   * @param {SubscriptionPlanFindByCriteriaRequestDto} [input] - Optional input parameters containing filters, sorts, and pagination settings.
   * @returns {Promise<PaginatedSubscriptionPlanResultDto>} A promise resolving to paginated results of subscription plans matching the provided criteria.
   */
  @Query(() => PaginatedSubscriptionPlanResultDto)
  async subscriptionPlanFindByCriteria(
    @Args('input', { nullable: true })
    input?: SubscriptionPlanFindByCriteriaRequestDto,
  ): Promise<PaginatedSubscriptionPlanResultDto> {
    this.logger.log(
      `Finding subscription plans with input: ${JSON.stringify(input)}`,
    );

    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindSubscriptionPlansByCriteriaQuery({ criteria }),
    );

    // 03: Convert to response DTO
    return this.subscriptionPlanGraphQLMapper.toPaginatedResponseDto(result);
  }

  /**
   * Finds a subscription plan by its ID.
   *
   * @param {string} id - The ID of the subscription plan to find.
   * @returns {Promise<SubscriptionPlanResponseDto>} The subscription plan response DTO.
   */
  @Query(() => SubscriptionPlanResponseDto)
  async subscriptionPlanFindById(
    @Args('input') input: SubscriptionPlanFindByIdRequestDto,
  ): Promise<SubscriptionPlanResponseDto> {
    this.logger.log(`Finding subscription plan with id: ${input.id}`);

    // 01: Execute query
    const result = await this.queryBus.execute(
      new FindSubscriptionPlanViewModelByIdQuery({ id: input.id }),
    );

    // 02: Convert to response DTO
    return this.subscriptionPlanGraphQLMapper.toResponseDto(result);
  }
}
