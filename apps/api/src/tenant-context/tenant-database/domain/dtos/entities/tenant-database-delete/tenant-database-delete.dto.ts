import { ITenantDatabaseCreateDto } from '@/tenant-context/tenant-database/domain/dtos/entities/tenant-database-create/tenant-database-create.dto';

/**
 * Data Transfer Object for deleting a tenant database.
 *
 * Allows deleting a tenant database entity by specifying only the tenant database's immutable identifier (`id`).
 * @type ITenantDatabaseDeleteDto
 * @property {TenantDatabaseUuidValueObject} id - The immutable identifier of the tenant database to delete.
 */
export type ITenantDatabaseDeleteDto = Pick<ITenantDatabaseCreateDto, 'id'>;
