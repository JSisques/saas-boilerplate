import { ITenantCreateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-create/tenant-create.dto';

/**
 * Data Transfer Object for updating a tenant.
 *
 * Allows partial updating of a tenant entity, excluding the tenant's immutable identifier (`id`).
 * @interface ITenantUpdateDto
 * @extends Partial<Omit<ITenantCreateDto, 'id'>>
 */
export interface ITenantUpdateDto
  extends Partial<Omit<ITenantCreateDto, 'id'>> {}
