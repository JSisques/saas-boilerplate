import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class TenantDatabaseAlreadyExistsException extends BaseApplicationException {
  constructor(id: string) {
    super(`Tenant database with id ${id} already exists`);
  }
}
