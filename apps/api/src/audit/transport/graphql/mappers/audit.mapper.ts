import { AuditViewModel } from '@/audit/domain/view-models/audit.view-model';
import {
  AuditResponseDto,
  PaginatedAuditResultDto,
} from '@/audit/transport/graphql/dtos/responses/audit.response.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Injectable } from '@nestjs/common';

export const AUDIT_GRAPHQL_MAPPER_TOKEN = Symbol('AuditGraphQLMapper');

@Injectable()
export class AuditGraphQLMapper {
  toResponseDto(audit: AuditViewModel): AuditResponseDto {
    return {
      id: audit.id,
      eventType: audit.eventType,
      aggregateType: audit.aggregateType,
      aggregateId: audit.aggregateId,
      payload: audit.payload ? JSON.stringify(audit.payload) : null,
      timestamp: audit.timestamp,
    };
  }

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<AuditViewModel>,
  ): PaginatedAuditResultDto {
    return {
      items: paginatedResult.items.map((audit) => this.toResponseDto(audit)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
