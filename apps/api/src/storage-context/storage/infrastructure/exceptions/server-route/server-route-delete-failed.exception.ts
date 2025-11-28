import { BaseInfrastructureException } from '@/shared/infrastructure/database/exceptions/base-infrastructure.exception';

/**
 * Server Route Delete Failed Exception
 * This exception is thrown when a file deletion from Server Route storage fails.
 */
export class ServerRouteDeleteFailedException extends BaseInfrastructureException {
  constructor(path: string) {
    super(`Failed to delete file from Server Route storage at path "${path}"`);
  }
}
