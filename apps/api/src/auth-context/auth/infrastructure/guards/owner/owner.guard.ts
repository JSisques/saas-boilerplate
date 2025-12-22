import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Owner Guard
 * Ensures users can only modify their own resources
 * Admins can modify any resource
 */
@Injectable()
export class OwnerGuard implements CanActivate {
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
    const userRole = (user as any).role as UserRoleEnum;

    // Admins can access any resource
    if (userRole === UserRoleEnum.ADMIN) {
      return true;
    }

    // Get the resource ID from args
    const args = ctx.getArgs();
    const resourceId = args?.input?.id;

    if (!resourceId) {
      throw new ForbiddenException('Resource ID is required');
    }

    // Get the authenticated user's ID
    const authenticatedUserId = (user as any).userId;

    if (!authenticatedUserId) {
      throw new ForbiddenException('User ID not found in token');
    }

    // Check if the user is trying to modify their own resource
    if (resourceId !== authenticatedUserId) {
      throw new ForbiddenException(
        'You can only access/modify your own resources',
      );
    }

    return true;
  }
}
