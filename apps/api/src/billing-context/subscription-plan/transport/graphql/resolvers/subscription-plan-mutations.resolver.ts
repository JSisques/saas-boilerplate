import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles.guard';
import { SubscriptionPlanCreateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-create/subscription-plan-create.command';
import { SubscriptionPlanDeleteCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-delete/subscription-plan-delete.command';
import { SubscriptionPlanUpdateCommand } from '@/billing-context/subscription-plan/application/commands/subscription-plan-update/subscription-plan-update.command';
import { SubscriptionPlanCreateRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-create.request.dto';
import { SubscriptionPlanDeleteRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-delete.request.dto';
import { SubscriptionPlanUpdateRequestDto } from '@/billing-context/subscription-plan/transport/graphql/dtos/requests/subscription-plan-update.request.dto';
import { UserRoleEnum } from '@/prisma/master/client';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
export class SubscriptionPlanMutationsResolver {
  private readonly logger = new Logger(SubscriptionPlanMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new subscription plan with the provided input data.
   *
   * @param {SubscriptionPlanCreateRequestDto} input - The information required to create a new subscription plan.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the tenant member was created successfully, a message, and the ID of the new tenant member.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionPlanCreate(
    @Args('input') input: SubscriptionPlanCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Creating subscription plan with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    const createdSubscriptionPlanId = await this.commandBus.execute(
      new SubscriptionPlanCreateCommand(input),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription plan created successfully',
      id: createdSubscriptionPlanId,
    });
  }

  /**
   * Updates an existing subscription plan with the provided input data.
   *
   * @param {SubscriptionPlanUpdateRequestDto} input - The update information for the subscription plan, including the subscription plan's ID.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the update was successful, a message, and the ID of the updated subscription plan.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionPlanUpdate(
    @Args('input') input: SubscriptionPlanUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Updating subscription plan with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionPlanUpdateCommand({
        id: input.id,
        name: input.name,
        type: input.type,
        description: input.description,
        priceMonthly: input.priceMonthly,
        currency: input.currency,
        interval: input.interval,
        intervalCount: input.intervalCount,
        trialPeriodDays: input.trialPeriodDays,
        features: input.features,
        limits: input.limits,
        stripePriceId: input.stripePriceId,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription plan updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes an existing subscription plan based on the provided subscription plan ID.
   *
   * @param {SubscriptionPlanDeleteRequestDto} input - The information containing the ID of the subscription plan to be deleted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deletion was successful, a message, and the ID of the deleted tenant.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionPlanDelete(
    @Args('input') input: SubscriptionPlanDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Deleting subscription plan with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionPlanDeleteCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription plan deleted successfully',
      id: input.id,
    });
  }
}
