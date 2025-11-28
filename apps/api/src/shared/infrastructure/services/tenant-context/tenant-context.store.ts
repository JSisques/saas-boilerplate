import { AsyncLocalStorage } from 'async_hooks';

/**
 * Tenant Context Store
 * Uses AsyncLocalStorage to maintain request context across async operations
 * This ensures tenantId is available even when REQUEST injection fails
 */
export class TenantContextStore {
  private static readonly asyncLocalStorage = new AsyncLocalStorage<{
    tenantId?: string;
    request?: any;
  }>();

  /**
   * Run a function with tenant context
   * @param context - Context object containing tenantId and/or request
   * @param fn - Function to run with context
   * @returns Result of the function
   */
  static run<T>(context: { tenantId?: string; request?: any }, fn: () => T): T {
    return this.asyncLocalStorage.run(context, fn);
  }

  /**
   * Get the current tenant context
   * @returns Current context or undefined if not in a context
   */
  static getContext(): { tenantId?: string; request?: any } | undefined {
    return this.asyncLocalStorage.getStore();
  }

  /**
   * Get tenant ID from current context
   * @returns Tenant ID or undefined if not found
   */
  static getTenantId(): string | undefined {
    const context = this.getContext();
    return context?.tenantId;
  }

  /**
   * Get request from current context
   * @returns Request or undefined if not found
   */
  static getRequest(): any {
    const context = this.getContext();
    return context?.request;
  }
}
