import { SagaInstanceAlreadyExistsException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-already-exists/saga-instance-already-exists.exception';

describe('SagaInstanceAlreadyExistsException', () => {
  describe('constructor', () => {
    it('should create exception with correct message', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const exception = new SagaInstanceAlreadyExistsException(sagaInstanceId);

      expect(exception).toBeInstanceOf(Error);
      expect(exception.message).toBe(
        `Saga instance with id ${sagaInstanceId} already exists`,
      );
      expect(exception.name).toBe('SagaInstanceAlreadyExistsException');
    });
  });
});
