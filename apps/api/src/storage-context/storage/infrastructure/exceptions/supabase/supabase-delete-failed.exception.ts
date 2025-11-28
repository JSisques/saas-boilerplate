import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Supabase Delete Failed Exception
 * This exception is thrown when a file deletion from Supabase storage fails.
 */
export class SupabaseDeleteFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to delete file from Supabase storage at path "${path}"`);
  }
}
