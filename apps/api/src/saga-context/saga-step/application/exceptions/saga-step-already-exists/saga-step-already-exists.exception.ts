import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SagaStepAlreadyExistsException extends BaseApplicationException {
  constructor(id: string) {
    super(`Saga step with id ${id} already exists`);
  }
}
