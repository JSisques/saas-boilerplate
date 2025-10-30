import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import {
  PaginatedTenantResultDto,
  TenantResponseDto,
} from '@/tenant-context/tenants/transport/graphql/dtos/responses/tenant/tenant.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantGraphQLMapper {
  toResponseDto(tenant: TenantViewModel): TenantResponseDto {
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      description: tenant.description,
      websiteUrl: tenant.websiteUrl,
      logoUrl: tenant.logoUrl,
      faviconUrl: tenant.faviconUrl,
      primaryColor: tenant.primaryColor,
      secondaryColor: tenant.secondaryColor,
      status: tenant.status,
      email: tenant.email,
      phoneNumber: tenant.phoneNumber,
      phoneCode: tenant.phoneCode,
      address: tenant.address,
      city: tenant.city,
      state: tenant.state,
      country: tenant.country,
      postalCode: tenant.postalCode,
      timezone: tenant.timezone,
      locale: tenant.locale,
      maxUsers: tenant.maxUsers,
      maxStorage: tenant.maxStorage,
      maxApiCalls: tenant.maxApiCalls,
      tenantMembers: tenant.tenantMembers,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<TenantViewModel>,
  ): PaginatedTenantResultDto {
    return {
      items: paginatedResult.items.map((tenant) => this.toResponseDto(tenant)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
