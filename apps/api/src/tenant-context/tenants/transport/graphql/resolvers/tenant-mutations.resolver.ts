import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { TenantCreateCommand } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command';
import { TenantDeleteCommand } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command';
import { TenantUpdateCommand } from '@/tenant-context/tenants/application/commands/tenant-update/tenant-update.command';
import { TenantCreateRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-create.request.dto';
import { TenantDeleteRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-delete.request.dto';
import { TenantUpdateRequestDto } from '@/tenant-context/tenants/transport/graphql/dtos/requests/tenant-update.request.dto';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class TenantMutationsResolver {
  private readonly logger = new Logger(TenantMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new tenant with the provided input data.
   *
   * @param {TenantCreateRequestDto} input - The information required to create a new tenant.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the tenant was created successfully, a message, and the ID of the new tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantCreate(
    @Args('input') input: TenantCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(`Creating tenant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    const createdTenantId = await this.commandBus.execute(
      new TenantCreateCommand({
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        logoUrl: input.logoUrl,
        faviconUrl: input.faviconUrl,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        email: input.email,
        phoneNumber: input.phoneNumber,
        phoneCode: input.phoneCode,
        address: input.address,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        timezone: input.timezone,
        locale: input.locale,
        maxUsers: input.maxUsers,
        maxStorage: input.maxStorage,
        maxApiCalls: input.maxApiCalls,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant created successfully',
      id: createdTenantId,
    });
  }

  /**
   * Updates an existing tenant with the provided input data.
   *
   * @param {TenantUpdateRequestDto} input - The update information for the tenant, including the tenant's ID.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the update was successful, a message, and the ID of the updated tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantUpdate(
    @Args('input') input: TenantUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(`Updating tenant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new TenantUpdateCommand({
        id: input.id,
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        logoUrl: input.logoUrl,
        faviconUrl: input.faviconUrl,
        primaryColor: input.primaryColor,
        secondaryColor: input.secondaryColor,
        status: input.status,
        email: input.email,
        phoneNumber: input.phoneNumber,
        phoneCode: input.phoneCode,
        address: input.address,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        timezone: input.timezone,
        locale: input.locale,
        maxUsers: input.maxUsers,
        maxStorage: input.maxStorage,
        maxApiCalls: input.maxApiCalls,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes an existing tenant based on the provided tenant ID.
   *
   * @param {TenantDeleteRequestDto} input - The information containing the ID of the tenant to be deleted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deletion was successful, a message, and the ID of the deleted tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantDelete(
    @Args('input') input: TenantDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(`Deleting tenant with input: ${JSON.stringify(input)}`);

    // 01: Send the command to the command bus
    await this.commandBus.execute(new TenantDeleteCommand({ id: input.id }));

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant deleted successfully',
      id: input.id,
    });
  }
}
