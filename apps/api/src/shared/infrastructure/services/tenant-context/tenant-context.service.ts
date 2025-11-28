import { TenantContextStore } from '@/shared/infrastructure/services/tenant-context/tenant-context.store';
import { Inject, Injectable, Logger, Optional, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

/**
 * Tenant Context Service
 * Extracts tenant ID from request in a safe way, supporting both REST and GraphQL contexts
 * Uses AsyncLocalStorage as fallback when REQUEST injection fails
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private readonly logger = new Logger(TenantContextService.name);

  constructor(
    @Optional() @Inject(REQUEST) private readonly request?: Request,
  ) {}

  /**
   * Extract tenant ID from request
   * Supports multiple sources:
   * 1. AsyncLocalStorage context (set by TenantContextInterceptor)
   * 2. request.tenantId (set by TenantContextInterceptor)
   * 3. Headers (x-tenant-id or X-Tenant-Id)
   * 4. User context
   * 5. Body
   * 6. Query params
   * @returns Tenant ID or undefined if not found
   */
  getTenantId(): string | undefined {
    // First, try to get from AsyncLocalStorage (most reliable for GraphQL)
    const contextTenantId = TenantContextStore.getTenantId();
    if (contextTenantId) {
      return contextTenantId;
    }

    // Fallback to request if available
    if (!this.request) {
      this.logger.warn('Request is not available in TenantContextService');
      return undefined;
    }

    // Try multiple sources in order of preference
    const tenantId =
      ((this.request as any).tenantId as string) ||
      (this.request.headers?.['x-tenant-id'] as string) ||
      (this.request.headers?.['X-Tenant-Id'] as string) ||
      (this.request.user as any)?.tenantId ||
      (this.request.body?.tenantId as string) ||
      (this.request.query?.tenantId as string);

    if (!tenantId) {
      this.logger.warn(
        `Tenant ID not found. Headers: ${JSON.stringify(this.request.headers)}`,
      );
    }

    return tenantId;
  }

  /**
   * Get tenant ID or throw error if not found
   * @returns Tenant ID
   * @throws Error if tenant ID is not found
   */
  getTenantIdOrThrow(): string {
    const tenantId = this.getTenantId();

    if (!tenantId) {
      throw new Error(
        'Tenant ID is required but not found in request. Please provide x-tenant-id header.',
      );
    }

    return tenantId;
  }
}
