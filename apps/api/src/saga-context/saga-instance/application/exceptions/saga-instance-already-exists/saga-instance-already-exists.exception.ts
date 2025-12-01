import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SagaInstanceAlreadyExistsException extends BaseApplicationException {
  constructor(id: string) {
    super(`Saga instance with id ${id} already exists`);
  }
}
