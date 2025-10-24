import { AuditAggregate } from '@/audit/domain/aggregates/audit.aggregate';

export const AUDIT_WRITE_REPOSITORY_TOKEN = Symbol('AuditWriteRepository');

export interface AuditWriteRepository {
  findById(id: string): Promise<AuditAggregate | null>;
  save(audit: AuditAggregate): Promise<AuditAggregate>;
  delete(id: string): Promise<boolean>;
}
