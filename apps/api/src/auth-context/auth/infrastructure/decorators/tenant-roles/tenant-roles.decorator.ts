import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { SetMetadata } from '@nestjs/common';

export const TENANT_ROLES_KEY = 'tenantRoles';

/**
 * TenantRoles Decorator
 * Sets required tenant roles for a route or resolver
 * @param roles - Array of allowed tenant roles
 * @returns Metadata decorator
 */
export const TenantRoles = (...roles: TenantMemberRoleEnum[]) =>
  SetMetadata(TENANT_ROLES_KEY, roles);
