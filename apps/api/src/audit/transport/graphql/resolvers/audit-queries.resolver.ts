import { FindAuditsByCriteriaQuery } from '@/audit/application/queries/find-audits-by-criteria/find-audits-by-criteria.command';
import { AuditFindByCriteriaRequestDto } from '@/audit/transport/graphql/dtos/requests/audit-find-by-criteria.request.dto';
import { PaginatedAuditResultDto } from '@/audit/transport/graphql/dtos/responses/audit.response.dto';
import {
  AUDIT_GRAPHQL_MAPPER_TOKEN,
  AuditGraphQLMapper,
} from '@/audit/transport/graphql/mappers/audit.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuditQueryResolver {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(AUDIT_GRAPHQL_MAPPER_TOKEN)
    private readonly auditGraphQLMapper: AuditGraphQLMapper,
  ) {}

  @Query(() => PaginatedAuditResultDto)
  async findAuditsByCriteria(
    @Args('input', { nullable: true }) input?: AuditFindByCriteriaRequestDto,
  ): Promise<PaginatedAuditResultDto> {
    // 01: Convert DTO to domain Criteria
    const criteria = new Criteria(
      input?.filters,
      input?.sorts,
      input?.pagination,
    );

    // 02: Execute query
    const result = await this.queryBus.execute(
      new FindAuditsByCriteriaQuery(criteria),
    );

    // 03: Convert to response DTO
    return this.auditGraphQLMapper.toPaginatedResponseDto(result);
  }
}
