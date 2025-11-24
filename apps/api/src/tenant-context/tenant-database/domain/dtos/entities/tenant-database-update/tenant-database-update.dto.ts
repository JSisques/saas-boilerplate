import { ITenantDatabaseCreateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-create/tenant-database-create.dto';

/**
 * Data Transfer Object for updating a tenant database.
 *
 * Allows partial updating of a tenant database entity, excluding the tenant database's immutable identifier (`id`).
 * @type ITenantDatabaseUpdateDto
 * @extends Partial<Omit<ITenantDatabaseCreateDto, 'id'>>
 */
export type ITenantDatabaseUpdateDto = Partial<
  Omit<ITenantDatabaseCreateDto, 'id'>
>;
