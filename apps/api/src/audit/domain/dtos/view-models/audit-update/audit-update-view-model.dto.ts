import { IAuditCreateViewModelDto } from '@/audit/domain/dtos/view-models/audit-create/audit-create-view-model.dto';

/**
 * Data Transfer Object for updating a audit view model.
 *
 * @interface IAuditUpdateViewModelDto
 * @property {string | null} eventType - The event type of the audit (nullable).
 * @property {string | null} aggregateType - The aggregate type of the audit (nullable).
 * @property {string | null} aggregateId - The aggregate id of the audit (nullable).
 * @property {string | null} payload - The payload of the audit (nullable).
 * @property {Date} timestamp - The timestamp of the audit (nullable).
 * @property {Date} createdAt - Timestamp when the audit was created.
 * @property {Date} updatedAt - Timestamp when the audit was last updated.
 */
export interface IAuditUpdateViewModelDto
  extends Partial<
    Omit<IAuditCreateViewModelDto, 'id' | 'createdAt' | 'updatedAt'>
  > {}
