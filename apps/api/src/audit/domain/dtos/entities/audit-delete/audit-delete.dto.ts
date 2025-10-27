import { IAuditCreateDto } from '@/audit/domain/dtos/entities/audit-create/audit-create.dto';

/**
 * Data Transfer Object for deleting an audit.
 *
 * Allows deleting an audit entity by specifying only the audit's immutable identifier (`id`).
 * @interface IAuditDeleteDto
 * @property {string} id - The immutable identifier of the audit to delete.
 */
export interface IAuditDeleteDto extends Pick<IAuditCreateDto, 'id'> {}
