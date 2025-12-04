import { FindSagaInstanceByIdQuery } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-id/saga-instance-find-by-id.query';
import { FindSagaInstanceByIdQueryHandler } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-id/saga-instance-find-by-id.query-handler';
import { AssertSagaInstanceExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import { SagaInstanceNotFoundException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-not-found/saga-instance-not-found.exception';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('FindSagaInstanceByIdQueryHandler', () => {
  let handler: FindSagaInstanceByIdQueryHandler;
  let mockAssertSagaInstanceExistsService: jest.Mocked<AssertSagaInstanceExistsService>;

  beforeEach(async () => {
    mockAssertSagaInstanceExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaInstanceByIdQueryHandler,
        {
          provide: AssertSagaInstanceExistsService,
          useValue: mockAssertSagaInstanceExistsService,
        },
      ],
    }).compile();

    handler = module.get<FindSagaInstanceByIdQueryHandler>(
      FindSagaInstanceByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createSagaInstanceAggregate = (): SagaInstanceAggregate => {
    const now = new Date();
    return new SagaInstanceAggregate(
      {
        id: new SagaInstanceUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new SagaInstanceNameValueObject('Order Processing Saga'),
        status: new SagaInstanceStatusValueObject(
          SagaInstanceStatusEnum.PENDING,
        ),
        startDate: null,
        endDate: null,
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  describe('execute', () => {
    it('should return saga instance aggregate when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaInstanceId };
      const query = new FindSagaInstanceByIdQuery(queryDto);

      const mockSagaInstance = createSagaInstanceAggregate();

      mockAssertSagaInstanceExistsService.execute.mockResolvedValue(
        mockSagaInstance,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockSagaInstance);
      expect(mockAssertSagaInstanceExistsService.execute).toHaveBeenCalledWith(
        sagaInstanceId,
      );
    });

    it('should throw SagaInstanceNotFoundException when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaInstanceId };
      const query = new FindSagaInstanceByIdQuery(queryDto);

      const error = new SagaInstanceNotFoundException(sagaInstanceId);

      mockAssertSagaInstanceExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(mockAssertSagaInstanceExistsService.execute).toHaveBeenCalledWith(
        sagaInstanceId,
      );
    });
  });
});
