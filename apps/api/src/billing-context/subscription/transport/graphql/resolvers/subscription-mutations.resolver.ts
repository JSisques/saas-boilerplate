import { JwtAuthGuard } from '@/auth-context/auth/infrastructure/auth/jwt-auth.guard';
import { Roles } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { RolesGuard } from '@/auth-context/auth/infrastructure/guards/roles.guard';
import { SubscriptionActivateCommand } from '@/billing-context/subscription/application/commands/subscription-activate/subscription-activate.command';
import { SubscriptionCancelCommand } from '@/billing-context/subscription/application/commands/subscription-cancel/subscription-cancel.command';
import { SubscriptionCreateCommand } from '@/billing-context/subscription/application/commands/subscription-create/subscription-create.command';
import { SubscriptionDeactivateCommand } from '@/billing-context/subscription/application/commands/subscription-deactivate/subscription-deactivate.command';
import { SubscriptionDeleteCommand } from '@/billing-context/subscription/application/commands/subscription-delete/subscription-delete.command';
import { SubscriptionRefundCommand } from '@/billing-context/subscription/application/commands/subscription-refund/subscription-refund.command';
import { SubscriptionUpdateCommand } from '@/billing-context/subscription/application/commands/subscription-update/subscription-update.command';
import { SubscriptionActivateRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-activate.request.dto';
import { SubscriptionCancelRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-cancel.request.dto';
import { SubscriptionCreateRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-create.request.dto';
import { SubscriptionDeactivateRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-deactivate.request.dto';
import { SubscriptionDeleteRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-delete.request.dto';
import { SubscriptionRefundRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-refund.request.dto';
import { SubscriptionUpdateRequestDto } from '@/billing-context/subscription/transport/graphql/dtos/requests/subscription-update.request.dto';
import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { Logger, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRoleEnum } from '@prisma/client';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN, UserRoleEnum.USER) // TODO: Check, only can create subscription for owner of the tenant
export class SubscriptionMutationsResolver {
  private readonly logger = new Logger(SubscriptionMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new subscription with the provided input data.
   *
   * @param {SubscriptionCreateRequestDto} input - The information required to create a new subscription.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the subscription was created successfully, a message, and the ID of the new subscription.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionCreate(
    @Args('input') input: SubscriptionCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Creating subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    const createdSubscriptionId = await this.commandBus.execute(
      new SubscriptionCreateCommand(input),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription created successfully',
      id: createdSubscriptionId,
    });
  }

  /**
   * Updates an existing subscription with the provided input data.
   *
   * @param {SubscriptionUpdateRequestDto} input - The update information for the subscription, including the subscription's ID.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the update was successful, a message, and the ID of the updated subscription plan.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionUpdate(
    @Args('input') input: SubscriptionUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Updating subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionUpdateCommand({
        id: input.id,
        tenantId: input.tenantId,
        planId: input.planId,
        startDate: input.startDate,
        endDate: input.endDate,
        trialEndDate: input.trialEndDate,
        status: input.status,
        stripeSubscriptionId: input.stripeSubscriptionId,
        stripeCustomerId: input.stripeCustomerId,
        renewalMethod: input.renewalMethod,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes an existing subscription based on the provided subscription ID.
   *
   * @param {SubscriptionDeleteRequestDto} input - The information containing the ID of the subscription to be deleted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deletion was successful, a message, and the ID of the deleted tenant.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionDelete(
    @Args('input') input: SubscriptionDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Deleting subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionDeleteCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription deleted successfully',
      id: input.id,
    });
  }

  /**
   * Activates an existing subscription based on the provided subscription ID.
   *
   * @param {SubscriptionActivateRequestDto} input - The information containing the ID of the subscription to be activated.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the activation was successful, a message, and the ID of the activated subscription.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionActivate(
    @Args('input') input: SubscriptionActivateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Activating subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionActivateCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription activated successfully',
      id: input.id,
    });
  }

  /**
   * Deactivates an existing subscription based on the provided subscription ID.
   *
   * @param {SubscriptionDeactivateRequestDto} input - The information containing the ID of the subscription to be deactivated.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deactivation was successful, a message, and the ID of the deactivated subscription.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionDeactivate(
    @Args('input') input: SubscriptionDeactivateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Deactivating subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionDeactivateCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription deactivated successfully',
      id: input.id,
    });
  }

  /**
   * Refunds an existing subscription based on the provided subscription ID.
   *
   * @param {SubscriptionRefundRequestDto} input - The information containing the ID of the subscription to be refunded.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the refund was successful, a message, and the ID of the refunded subscription.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionRefund(
    @Args('input') input: SubscriptionRefundRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Refunding subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionRefundCommand({ id: input.id }),
    );
    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription refunded successfully',
      id: input.id,
    });
  }

  /**
   * Cancels an existing subscription based on the provided subscription ID.
   *
   * @param {SubscriptionCancelRequestDto} input - The information containing the ID of the subscription to be canceled.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the cancellation was successful, a message, and the ID of the canceled subscription.
   */
  @Mutation(() => MutationResponseDto)
  async subscriptionCancel(
    @Args('input') input: SubscriptionCancelRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.log(
      `Canceling subscription with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new SubscriptionCancelCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Subscription canceled successfully',
      id: input.id,
    });
  }
}
