import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class TenantMigrationFailedException extends BaseApplicationException {
  constructor(error: string) {
    super(`Tenant migration failed: ${error}`);
  }
}
