import { FindSagaLogByIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-by-id/saga-log-find-by-id.query';
import { FindSagaLogByIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-id/saga-log-find-by-id.query-handler';
import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogNotFoundException } from '@/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Test } from '@nestjs/testing';

describe('FindSagaLogByIdQueryHandler', () => {
  let handler: FindSagaLogByIdQueryHandler;
  let mockAssertSagaLogExistsService: jest.Mocked<AssertSagaLogExistsService>;

  beforeEach(async () => {
    mockAssertSagaLogExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaLogExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaLogByIdQueryHandler,
        {
          provide: AssertSagaLogExistsService,
          useValue: mockAssertSagaLogExistsService,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogByIdQueryHandler>(
      FindSagaLogByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createSagaLogAggregate = (): SagaLogAggregate => {
    const now = new Date();
    return new SagaLogAggregate(
      {
        id: new SagaLogUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
        sagaInstanceId: new SagaInstanceUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        sagaStepId: new SagaStepUuidValueObject(
          '323e4567-e89b-12d3-a456-426614174000',
        ),
        type: new SagaLogTypeValueObject(SagaLogTypeEnum.INFO),
        message: new SagaLogMessageValueObject('Test log message'),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  describe('execute', () => {
    it('should return saga log aggregate when saga log exists', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaLogId };
      const query = new FindSagaLogByIdQuery(queryDto);

      const mockSagaLog = createSagaLogAggregate();

      mockAssertSagaLogExistsService.execute.mockResolvedValue(mockSagaLog);

      const result = await handler.execute(query);

      expect(result).toBe(mockSagaLog);
      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledWith(
        sagaLogId,
      );
      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaLogNotFoundException when saga log does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaLogId };
      const query = new FindSagaLogByIdQuery(queryDto);

      const error = new SagaLogNotFoundException(sagaLogId);
      mockAssertSagaLogExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(
        SagaLogNotFoundException,
      );
      expect(mockAssertSagaLogExistsService.execute).toHaveBeenCalledWith(
        sagaLogId,
      );
    });
  });
});
