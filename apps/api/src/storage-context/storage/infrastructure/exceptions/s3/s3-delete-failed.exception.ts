import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * S3 Delete Failed Exception
 * This exception is thrown when a file deletion from S3 storage fails.
 */
export class S3DeleteFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to delete file from S3 storage at path "${path}"`);
  }
}
