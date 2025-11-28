import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Supabase File Not Found Exception
 * This exception is thrown when a file is not found in Supabase storage.
 */
export class SupabaseFileNotFoundException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`File not found in Supabase storage at path "${path}"`);
  }
}
