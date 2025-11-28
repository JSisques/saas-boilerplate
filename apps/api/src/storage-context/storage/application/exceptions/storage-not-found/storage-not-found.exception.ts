import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class StorageNotFoundException extends BaseApplicationException {
  constructor(storageId: string) {
    super(`Storage with id ${storageId} not found`);
  }
}
