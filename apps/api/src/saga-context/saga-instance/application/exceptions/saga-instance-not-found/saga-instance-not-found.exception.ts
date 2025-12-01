import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SagaInstanceNotFoundException extends BaseApplicationException {
  constructor(sagaInstanceId: string) {
    super(`Saga instance with id ${sagaInstanceId} not found`);
  }
}
