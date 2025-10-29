import { IAuditCreateDto } from '@/audit-context/audit/domain/dtos/entities/audit-create/audit-create.dto';

/**
 * Data Transfer Object for updating an audit.
 *
 * Allows partial updating of an audit entity, excluding the audit's immutable identifier (`id`).
 * @interface IAuditUpdateDto
 * @extends Partial<Omit<IAuditCreateDto, 'id' | 'timestamp'>>
 */
export interface IAuditUpdateDto
  extends Partial<Omit<IAuditCreateDto, 'id' | 'timestamp'>> {}
