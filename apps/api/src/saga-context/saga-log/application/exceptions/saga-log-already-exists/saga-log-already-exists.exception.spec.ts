import { SagaLogAlreadyExistsException } from '@/saga-context/saga-log/application/exceptions/saga-log-already-exists/saga-log-already-exists.exception';
import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

describe('SagaLogAlreadyExistsException', () => {
  it('should be an instance of BaseApplicationException', () => {
    const exception = new SagaLogAlreadyExistsException('test-id');
    expect(exception).toBeInstanceOf(BaseApplicationException);
  });

  it('should have correct message', () => {
    const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
    const exception = new SagaLogAlreadyExistsException(sagaLogId);

    expect(exception.message).toBe(
      `Saga log with id ${sagaLogId} already exists`,
    );
  });

  it('should include saga log id in message', () => {
    const sagaLogId = 'test-saga-log-id';
    const exception = new SagaLogAlreadyExistsException(sagaLogId);

    expect(exception.message).toContain(sagaLogId);
  });
});
