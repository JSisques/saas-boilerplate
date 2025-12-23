import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Tenant Guard
 * Ensures users can only access resources from their own tenants
 * Admins can access any tenant resource
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Get GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Get user from request (attached by JwtStrategy)
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user role
    const userRole = user.role as UserRoleEnum;

    // Admins can access any tenant resource
    if (userRole === UserRoleEnum.ADMIN) {
      return true;
    }

    // Get tenantIds from user (from JWT payload)
    const userTenantIds = user.tenantIds as string[];

    if (!userTenantIds || userTenantIds.length === 0) {
      throw new ForbiddenException('User does not have access to any tenants');
    }

    // Get the tenant ID from request headers (x-tenant-id)
    // This is the standard way to pass tenant context in multi-tenant applications
    const tenantId =
      (request.headers?.['x-tenant-id'] as string) ||
      (request.headers?.['X-Tenant-Id'] as string) ||
      ((request as any).tenantId as string);

    if (!tenantId) {
      // If no tenantId is provided in headers, we can't validate, so we deny access
      // This ensures that operations requiring tenant validation must include x-tenant-id header
      throw new ForbiddenException(
        'Tenant ID is required. Please provide x-tenant-id header.',
      );
    }

    // Check if the user has access to the requested tenant
    if (!userTenantIds.includes(tenantId)) {
      throw new ForbiddenException(
        'You do not have access to this tenant resource',
      );
    }

    return true;
  }
}
