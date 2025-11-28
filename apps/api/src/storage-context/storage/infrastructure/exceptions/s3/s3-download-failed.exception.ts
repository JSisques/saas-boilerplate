import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * S3 Download Failed Exception
 * This exception is thrown when a file download from S3 storage fails.
 */
export class S3DownloadFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to download file from S3 storage at path "${path}"`);
  }
}
