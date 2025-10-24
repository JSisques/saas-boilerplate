import { FindAuditsByCriteriaQuery } from '@/audit/application/queries/find-audits-by-criteria/find-audits-by-criteria.command';
import {
  AUDIT_READ_REPOSITORY_TOKEN,
  AuditReadRepository,
} from '@/audit/domain/repositories/audit-read.repository';
import { AuditViewModel } from '@/audit/domain/view-models/audit.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(FindAuditsByCriteriaQuery)
export class FindAuditsByCriteriaQueryHandler
  implements IQueryHandler<FindAuditsByCriteriaQuery>
{
  constructor(
    @Inject(AUDIT_READ_REPOSITORY_TOKEN)
    private readonly auditReadRepository: AuditReadRepository,
  ) {}

  async execute(
    query: FindAuditsByCriteriaQuery,
  ): Promise<PaginatedResult<AuditViewModel>> {
    return this.auditReadRepository.findByCriteria(query.criteria);
  }
}
