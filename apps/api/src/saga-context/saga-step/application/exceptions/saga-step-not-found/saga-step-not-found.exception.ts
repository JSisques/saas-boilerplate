import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

export class SagaStepNotFoundException extends BaseApplicationException {
  constructor(sagaStepId: string) {
    super(`Saga step with id ${sagaStepId} not found`);
  }
}
