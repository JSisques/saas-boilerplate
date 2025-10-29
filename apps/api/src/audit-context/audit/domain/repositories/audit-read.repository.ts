import { AuditViewModel } from '@/audit-context/audit/domain/view-models/audit.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

export const AUDIT_READ_REPOSITORY_TOKEN = Symbol('AuditReadRepository');

export interface AuditReadRepository {
  findById(id: string): Promise<AuditViewModel | null>;
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<AuditViewModel>>;
  save(auditViewModel: AuditViewModel): Promise<void>;
  delete(id: string): Promise<boolean>;
}
