import { ITenantCreateDto } from '@/tenant-context/tenants/domain/dtos/entities/tenant-create/tenant-create.dto';

/**
 * Data Transfer Object for deleting a tenant.
 *
 * Allows deleting a tenant entity by specifying only the tenant's immutable identifier (`id`).
 * @type ITenantDeleteDto
 * @property {string} id - The immutable identifier of the tenant to delete.
 */
export type ITenantDeleteDto = Pick<ITenantCreateDto, 'id'>;
