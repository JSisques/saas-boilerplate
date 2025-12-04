import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SagaLogAlreadyExistsException extends BaseApplicationException {
  constructor(id: string) {
    super(`Saga log with id ${id} already exists`);
  }
}
