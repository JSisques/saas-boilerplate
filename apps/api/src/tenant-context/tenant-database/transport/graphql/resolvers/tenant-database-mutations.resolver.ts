import { MutationResponseDto } from '@/shared/transport/graphql/dtos/responses/success-response/success-response.dto';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';
import { TenantDatabaseCreateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-create/tenant-database-create.command';
import { TenantDatabaseDeleteCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command';
import { TenantDatabaseUpdateCommand } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command';
import { TenantDatabaseCreateRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-create.request.dto';
import { TenantDatabaseDeleteRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-delete.request.dto';
import { TenantDatabaseUpdateRequestDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/requests/tenant-database-update.request.dto';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

@Resolver()
export class TenantDatabaseMutationsResolver {
  private readonly logger = new Logger(TenantDatabaseMutationsResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly mutationResponseGraphQLMapper: MutationResponseGraphQLMapper,
  ) {}

  /**
   * Creates a new tenant database with the provided input data.
   *
   * @param {TenantDatabaseCreateRequestDto} input - The information required to create a new tenant database.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the tenant member was created successfully, a message, and the ID of the new tenant member.
   */
  @Mutation(() => MutationResponseDto)
  async tenantDatabaseCreate(
    @Args('input') input: TenantDatabaseCreateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(
      `Creating tenant database with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    const createdTenantDatabaseId = await this.commandBus.execute(
      new TenantDatabaseCreateCommand({
        tenantId: input.tenantId,
        databaseName: input.databaseName,
        databaseUrl: input.databaseUrl,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant database created successfully',
      id: createdTenantDatabaseId,
    });
  }

  /**
   * Updates an existing tenant database with the provided input data.
   *
   * @param {TenantDatabaseUpdateRequestDto} input - The update information for the tenant database, including the tenant database's ID.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the update was successful, a message, and the ID of the updated tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantDatabaseUpdate(
    @Args('input') input: TenantDatabaseUpdateRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(
      `Updating tenant database with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new TenantDatabaseUpdateCommand({
        id: input.id,
        databaseName: input.databaseName,
        databaseUrl: input.databaseUrl,
        status: input.status,
        schemaVersion: input.schemaVersion,
        lastMigrationAt: input.lastMigrationAt,
        errorMessage: input.errorMessage,
      }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant database updated successfully',
      id: input.id,
    });
  }

  /**
   * Deletes an existing tenant database based on the provided tenant database ID.
   *
   * @param {TenantDatabaseDeleteRequestDto} input - The information containing the ID of the tenant database to be deleted.
   * @returns {Promise<MutationResponseDto>} The result indicating whether the deletion was successful, a message, and the ID of the deleted tenant.
   */
  @Mutation(() => MutationResponseDto)
  async tenantDatabaseDelete(
    @Args('input') input: TenantDatabaseDeleteRequestDto,
  ): Promise<MutationResponseDto> {
    this.logger.debug(
      `Deleting tenant database with input: ${JSON.stringify(input)}`,
    );

    // 01: Send the command to the command bus
    await this.commandBus.execute(
      new TenantDatabaseDeleteCommand({ id: input.id }),
    );

    // 02: Return success response
    return this.mutationResponseGraphQLMapper.toResponseDto({
      success: true,
      message: 'Tenant database deleted successfully',
      id: input.id,
    });
  }
}
