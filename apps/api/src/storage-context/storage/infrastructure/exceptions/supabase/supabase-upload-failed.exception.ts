import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Supabase Upload Failed Exception
 * This exception is thrown when a file upload to Supabase storage fails.
 */
export class SupabaseUploadFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to upload file to Supabase storage at path "${path}"`);
  }
}
