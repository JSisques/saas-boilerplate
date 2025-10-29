/**
 * Audit creation view model Data Transfer Object.
 *
 * Represents the structure of data returned when a audit is created, tailored for presentation layers.
 *
 * @interface IAuditCreateViewModelDto
 * @property {string} id - The unique, immutable identifier of the audit.
 * @property {string} eventType - The event type of the audit.
 * @property {string} aggregateType - The aggregate type of the audit.
 * @property {string} aggregateId - The aggregate id of the audit.
 * @property {string} payload - The payload of the audit.
 * @property {Date} timestamp - The timestamp of the audit.
 * @property {Date} createdAt - Timestamp when the audit was created.
 * @property {Date} updatedAt - Timestamp when the audit was last updated.
 */
export interface IAuditCreateViewModelDto {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}
