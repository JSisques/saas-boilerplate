import { FindSagaLogsBySagaInstanceIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-by-saga-instance-id/saga-log-find-by-saga-instance-id.query';
import { FindSagaLogsBySagaInstanceIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-saga-instance-id/saga-log-find-by-saga-instance-id.query-handler';
import {
  SAGA_LOG_WRITE_REPOSITORY_TOKEN,
  SagaLogWriteRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogAggregate } from '@/saga-context/saga-log/domain/aggregates/saga-log.aggregate';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogMessageValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-message/saga-log-message.vo';
import { SagaLogTypeValueObject } from '@/saga-context/saga-log/domain/value-objects/saga-log-type/saga-log-type.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaLogUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-log-uuid/saga-log-uuid.vo';
import { SagaStepUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-step-uuid/saga-step-uuid.vo';
import { Test } from '@nestjs/testing';

describe('FindSagaLogsBySagaInstanceIdQueryHandler', () => {
  let handler: FindSagaLogsBySagaInstanceIdQueryHandler;
  let mockSagaLogWriteRepository: jest.Mocked<SagaLogWriteRepository>;

  beforeEach(async () => {
    mockSagaLogWriteRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findBySagaStepId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaLogWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaLogsBySagaInstanceIdQueryHandler,
        {
          provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaLogWriteRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogsBySagaInstanceIdQueryHandler>(
      FindSagaLogsBySagaInstanceIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createSagaLogAggregate = (
    id: string,
    sagaInstanceId: string,
    sagaStepId: string,
    type: SagaLogTypeEnum,
    message: string,
  ): SagaLogAggregate => {
    const now = new Date();
    return new SagaLogAggregate(
      {
        id: new SagaLogUuidValueObject(id),
        sagaInstanceId: new SagaInstanceUuidValueObject(sagaInstanceId),
        sagaStepId: new SagaStepUuidValueObject(sagaStepId),
        type: new SagaLogTypeValueObject(type),
        message: new SagaLogMessageValueObject(message),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      },
      false,
    );
  };

  describe('execute', () => {
    it('should return array of saga log aggregates when saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaLogsBySagaInstanceIdQuery(queryDto);

      const mockSagaLogs = [
        createSagaLogAggregate(
          '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId,
          '323e4567-e89b-12d3-a456-426614174000',
          SagaLogTypeEnum.INFO,
          'Log message 1',
        ),
        createSagaLogAggregate(
          '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId,
          '323e4567-e89b-12d3-a456-426614174000',
          SagaLogTypeEnum.ERROR,
          'Log message 2',
        ),
      ];

      mockSagaLogWriteRepository.findBySagaInstanceId.mockResolvedValue(
        mockSagaLogs,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockSagaLogs);
      expect(result).toHaveLength(2);
      expect(
        mockSagaLogWriteRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
      expect(
        mockSagaLogWriteRepository.findBySagaInstanceId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no saga logs exist for saga instance', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaLogsBySagaInstanceIdQuery(queryDto);

      mockSagaLogWriteRepository.findBySagaInstanceId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(
        mockSagaLogWriteRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
    });
  });
});
