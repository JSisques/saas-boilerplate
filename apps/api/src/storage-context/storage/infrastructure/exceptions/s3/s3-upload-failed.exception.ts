import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * S3 Upload Failed Exception
 * This exception is thrown when a file upload to S3 storage fails.
 */
export class S3UploadFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to upload file to S3 storage at path "${path}"`);
  }
}
