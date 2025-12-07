import { IBaseEventData } from './base-event-data.interface';

/**
 * Base interface for event data that can optionally include tenant context.
 * This allows events to be tenant-specific or global depending on the context.
 *
 * Use this interface when:
 * - Events can be triggered in both tenant and global contexts
 * - Events need to track which tenant they're associated with
 * - Events need to create or reference a tenant during processing
 */
export interface IEventDataWithTenantContext extends IBaseEventData {
  tenantId?: string;
  tenantName?: string;
}
