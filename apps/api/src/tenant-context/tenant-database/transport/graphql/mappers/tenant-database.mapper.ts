import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantDatabaseViewModel } from '@/tenant-context/tenant-database/domain/view-models/tenant-database/tenant-database.view-model';
import { TenantDatabaseResponseDto } from '@/tenant-context/tenant-database/transport/graphql/dtos/responses/tenant-database.response.dto';
import { PaginatedTenantMemberResultDto } from '@/tenant-context/tenant-members/transport/graphql/dtos/responses/tenant-member.response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { TenantDatabaseStatusEnum } from '@prisma/client';

@Injectable()
export class TenantDatabaseGraphQLMapper {
  private readonly logger = new Logger(TenantDatabaseGraphQLMapper.name);

  /**
   * Maps a tenant database view model to a response DTO.
   *
   * @param tenantDatabase - The tenant database view model to map.
   * @returns The response DTO.
   */
  public toResponseDto(
    tenantDatabase: TenantDatabaseViewModel,
  ): TenantDatabaseResponseDto {
    this.logger.log(
      `Mapping tenant database view model to response dto: ${tenantDatabase.id}`,
    );
    return {
      id: tenantDatabase.id,
      tenantId: tenantDatabase.tenantId,
      databaseName: tenantDatabase.databaseName,
      databaseUrl: tenantDatabase.databaseUrl,
      status: tenantDatabase.status as TenantDatabaseStatusEnum,
      schemaVersion: tenantDatabase.schemaVersion,
      lastMigrationAt: tenantDatabase.lastMigrationAt,
      errorMessage: tenantDatabase.errorMessage,
      createdAt: tenantDatabase.createdAt,
      updatedAt: tenantDatabase.updatedAt,
    };
  }

  /**
   * Maps a paginated result of tenant database view models to a paginated response DTO.
   *
   * @param paginatedResult - The paginated result of tenant database view models to map.
   * @returns The paginated response DTO.
   */
  public toPaginatedResponseDto(
    paginatedResult: PaginatedResult<TenantDatabaseViewModel>,
  ): PaginatedTenantMemberResultDto {
    return {
      items: paginatedResult.items.map((tenant) => this.toResponseDto(tenant)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
