import { UserRoleEnum } from '@/prisma/master/client';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * Sets required roles for a route or resolver
 * @param roles - Array of allowed roles
 * @returns Metadata decorator
 */
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
