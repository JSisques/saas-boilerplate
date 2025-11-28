import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Supabase Download Failed Exception
 * This exception is thrown when a file download from Supabase storage fails.
 */
export class SupabaseDownloadFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to download file from Supabase storage at path "${path}"`);
  }
}
