import { TENANT_ROLES_KEY } from '@/auth-context/auth/infrastructure/decorators/tenant-roles/tenant-roles.decorator';
import { TenantMemberRoleEnum } from '@/prisma/master/client';
import { FindTenantMemberByTenantIdAndUserIdQuery } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id-and-user-id/tenant-member-find-by-tenant-id-and-user-id.query';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { QueryBus } from '@nestjs/cqrs';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * TenantRoles Guard
 * Enforces role-based access control based on user roles within a tenant
 * Requires x-tenant-id header to be present
 */
@Injectable()
export class TenantRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly queryBus: QueryBus,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required tenant roles from metadata
    const requiredTenantRoles = this.reflector.getAllAndOverride<
      TenantMemberRoleEnum[]
    >(TENANT_ROLES_KEY, [context.getHandler(), context.getClass()]);

    // If no tenant roles are required, allow access
    if (!requiredTenantRoles) {
      return true;
    }

    // Get GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Get user from request (attached by JwtStrategy)
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get the tenant ID from request headers (x-tenant-id)
    const tenantId =
      (request.headers?.['x-tenant-id'] as string) ||
      (request.headers?.['X-Tenant-Id'] as string) ||
      ((request as any).tenantId as string);

    if (!tenantId) {
      throw new ForbiddenException(
        'Tenant ID is required. Please provide x-tenant-id header.',
      );
    }

    // Get user ID from request
    const userId = user.userId;

    if (!userId) {
      throw new ForbiddenException('User ID not found in token');
    }

    // Find tenant member to get the user's role in this tenant
    const tenantMember = await this.queryBus.execute(
      new FindTenantMemberByTenantIdAndUserIdQuery({
        tenantId,
        userId,
      }),
    );

    if (!tenantMember) {
      throw new ForbiddenException('User is not a member of this tenant');
    }

    // Get user's tenant role
    const userTenantRole = tenantMember.role.value as TenantMemberRoleEnum;

    if (!userTenantRole) {
      throw new ForbiddenException('User tenant role not found');
    }

    // Check if user has required tenant role
    const hasRole = requiredTenantRoles.includes(userTenantRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Insufficient tenant permissions. Required roles: ${requiredTenantRoles.join(', ')}. Your role: ${userTenantRole}`,
      );
    }

    return true;
  }
}
