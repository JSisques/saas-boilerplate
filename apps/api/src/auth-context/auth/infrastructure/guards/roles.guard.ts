import { ROLES_KEY } from '@/auth-context/auth/infrastructure/decorators/roles/roles.decorator';
import { UserRoleEnum } from '@/prisma/master/client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Roles Guard
 * Enforces role-based access control based on user roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles) {
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

    // Get user role from JWT payload (added by JwtStrategy)
    const userRole = (user as any).role;

    if (!userRole) {
      throw new ForbiddenException('User role not found');
    }

    // Check if user has required role
    const hasRole = requiredRoles.includes(userRole as UserRoleEnum);

    if (!hasRole) {
      throw new ForbiddenException(
        'Insufficient permissions. Required roles: ' + requiredRoles.join(', '),
      );
    }

    return true;
  }
}
