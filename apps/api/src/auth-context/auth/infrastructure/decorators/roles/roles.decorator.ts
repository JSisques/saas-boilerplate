import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * Sets required roles for a route or resolver
 * @param roles - Array of allowed roles
 * @returns Metadata decorator
 */
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
