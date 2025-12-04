import { SagaLogNotFoundException } from '@/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import { BaseApplicationException } from '@/shared/application/exceptions/base-application/base-application.exception';

describe('SagaLogNotFoundException', () => {
  it('should be an instance of BaseApplicationException', () => {
    const exception = new SagaLogNotFoundException('test-id');
    expect(exception).toBeInstanceOf(BaseApplicationException);
  });

  it('should have correct message', () => {
    const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
    const exception = new SagaLogNotFoundException(sagaLogId);

    expect(exception.message).toBe(`Saga log with id ${sagaLogId} not found`);
  });

  it('should include saga log id in message', () => {
    const sagaLogId = 'test-saga-log-id';
    const exception = new SagaLogNotFoundException(sagaLogId);

    expect(exception.message).toContain(sagaLogId);
  });
});
