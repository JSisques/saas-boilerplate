import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Server Route Download Failed Exception
 * This exception is thrown when a file download from Server Route storage fails.
 */
export class ServerRouteDownloadFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(
      `Failed to download file from Server Route storage at path "${path}"`,
    );
  }
}
