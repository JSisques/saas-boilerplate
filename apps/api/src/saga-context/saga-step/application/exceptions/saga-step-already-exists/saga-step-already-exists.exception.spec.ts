import { SagaStepAlreadyExistsException } from '@/saga-context/saga-step/application/exceptions/saga-step-already-exists/saga-step-already-exists.exception';
import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

describe('SagaStepAlreadyExistsException', () => {
  it('should be an instance of BaseApplicationException', () => {
    const exception = new SagaStepAlreadyExistsException('test-id');
    expect(exception).toBeInstanceOf(BaseApplicationException);
  });

  it('should have correct message', () => {
    const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
    const exception = new SagaStepAlreadyExistsException(sagaStepId);

    expect(exception.message).toBe(
      `Saga step with id ${sagaStepId} already exists`,
    );
  });

  it('should include saga step id in message', () => {
    const sagaStepId = 'test-saga-step-id';
    const exception = new SagaStepAlreadyExistsException(sagaStepId);

    expect(exception.message).toContain(sagaStepId);
  });
});
