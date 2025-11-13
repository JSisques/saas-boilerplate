import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Server Route Upload Failed Exception
 * This exception is thrown when a file upload to Server Route storage fails.
 */
export class ServerRouteUploadFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to upload file to Server Route storage at path "${path}"`);
  }
}
