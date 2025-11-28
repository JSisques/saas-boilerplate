import { TenantContextStore } from '@/shared/infrastructure/services/tenant-context/tenant-context.store';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

/**
 * Tenant Context Interceptor
 * Extracts tenant ID from request headers and attaches it to the request object
 * This ensures the tenantId is available throughout the request lifecycle
 * Works with both REST and GraphQL contexts
 * Uses AsyncLocalStorage to maintain context across async operations
 */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Try to get request from GraphQL context first, then from HTTP context
    let request: any;

    try {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } catch {
      // If not GraphQL context, try HTTP context
      request = context.switchToHttp().getRequest();
    }

    // Extract tenant ID from headers
    const tenantId =
      request &&
      ((request.headers?.['x-tenant-id'] as string) ||
        (request.headers?.['X-Tenant-Id'] as string) ||
        (request.user as any)?.tenantId ||
        (request.body?.tenantId as string) ||
        (request.query?.tenantId as string));

    // Attach tenantId to request for easy access
    if (request && tenantId) {
      (request as any).tenantId = tenantId;
    }

    // Run the handler within the tenant context using AsyncLocalStorage
    // This ensures tenantId is available even when REQUEST injection fails
    return TenantContextStore.run({ tenantId, request }, () => {
      return next.handle();
    });
  }
}
