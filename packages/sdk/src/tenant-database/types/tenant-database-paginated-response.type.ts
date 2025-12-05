import type { PaginatedResult } from '../../shared/types/index.js';
import type { TenantDatabaseResponse } from './tenant-database-response.type.js';

export type PaginatedTenantDatabaseResult =
  PaginatedResult<TenantDatabaseResponse>;
