import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SagaLogNotFoundException extends BaseApplicationException {
  constructor(sagaLogId: string) {
    super(`Saga log with id ${sagaLogId} not found`);
  }
}
