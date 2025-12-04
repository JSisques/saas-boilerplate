import { SagaInstanceNotFoundException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-not-found/saga-instance-not-found.exception';

describe('SagaInstanceNotFoundException', () => {
  describe('constructor', () => {
    it('should create exception with correct message', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const exception = new SagaInstanceNotFoundException(sagaInstanceId);

      expect(exception).toBeInstanceOf(Error);
      expect(exception.message).toBe(
        `Saga instance with id ${sagaInstanceId} not found`,
      );
      expect(exception.name).toBe('SagaInstanceNotFoundException');
    });
  });
});
