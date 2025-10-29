import { MutationResponseDto } from '@/shared/transport/graphql/dtos/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response.mapper';
import { TenantMemberAddCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-add/tenant-member-add.command';
import { TenantMemberRemoveCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-remove/tenant-member-remove.command';
import { TenantMemberUpdateCommand } from '@/tenant-context/tenant-members/application/commands/tenant-member-update/tenant-member-update.command';
import { TenantMemberAddRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-add.request.dto';
import { TenantMemberRemoveRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-remove.request.dto';
import { TenantMemberUpdateRequestDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/requests/tenant-member-update.request.dto';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class TenantMemberMutationsResolver {
  private readonly logger = new Logger(TenantMemberMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new tenant member with the provided input data.
   *
   * @param {TenantMemberCreateRequestDto} input - The information required to create a new tenant member.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the tenant member was created successfully, a message, and the ID of the new tenant member.
   */
  @Mutation(() => MutationResponseDto)
  async tenantMemberAdd(
    @Args('input') input: TenantMemberAddRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(
      `Adding tenant member with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    const addedTenantMemberId = await this.commandBus.execute(
      new TenantMemberAddCommand({
        tenantId: input.tenantId,
        userId: input.userId,
        role: input.role,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant member added successfully',
      id: addedTenantMemberId,
    });
  }

  /**
   * Updates an existing tenant member with the provided input data.
   *
   * @param {TenantMemberUpdateRequestDto} input - The update information for the tenant member, including the tenant member's ID.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the update was successful, a message, and the ID of the updated tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantMemberUpdate(
    @Args('input') input: TenantMemberUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(
      `Updating tenant member with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new TenantMemberUpdateCommand({
        id: input.id,
        role: input.role,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant member updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes an existing tenant member based on the provided tenant member ID.
   *
   * @param {TenantMemberDeleteRequestDto} input - The information containing the ID of the tenant member to be deleted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deletion was successful, a message, and the ID of the deleted tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantMemberRemove(
    @Args('input') input: TenantMemberRemoveRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(
      `Deleting tenant member with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new TenantMemberRemoveCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant member removed successfully',
      id: input.id,
    });
  }
}
