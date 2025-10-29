import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member.view-model';
import {
  PaginatedTenantMemberResultDto,
  TenantMemberResponseDto,
} from '@/tenant-context/tenant-members/transport/graphql/dtos/responses/tenant-member.response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantMemberGraphQLMapper {
  toResponseDto(tenantMember: TenantMemberViewModel): TenantMemberResponseDto {
    return {
      id: tenantMember.id,
      tenantId: tenantMember.tenantId,
      userId: tenantMember.userId,
      role: tenantMember.role,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<TenantMemberViewModel>,
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
