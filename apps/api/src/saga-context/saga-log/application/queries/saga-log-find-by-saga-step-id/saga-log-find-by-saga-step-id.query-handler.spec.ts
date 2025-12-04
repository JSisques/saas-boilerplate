import { FindSagaLogsBySagaStepIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-by-saga-step-id/saga-log-find-by-saga-step-id.query';
import { FindSagaLogsBySagaStepIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-saga-step-id/saga-log-find-by-saga-step-id.query-handler';
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

describe('FindSagaLogsBySagaStepIdQueryHandler', () => {
  let handler: FindSagaLogsBySagaStepIdQueryHandler;
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
        FindSagaLogsBySagaStepIdQueryHandler,
        {
          provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaLogWriteRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogsBySagaStepIdQueryHandler>(
      FindSagaLogsBySagaStepIdQueryHandler,
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
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaStepId };
      const query = new FindSagaLogsBySagaStepIdQuery(queryDto);

      const mockSagaLogs = [
        createSagaLogAggregate(
          '123e4567-e89b-12d3-a456-426614174000',
          '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId,
          SagaLogTypeEnum.INFO,
          'Log message 1',
        ),
        createSagaLogAggregate(
          '223e4567-e89b-12d3-a456-426614174001',
          '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId,
          SagaLogTypeEnum.ERROR,
          'Log message 2',
        ),
      ];

      mockSagaLogWriteRepository.findBySagaStepId.mockResolvedValue(
        mockSagaLogs,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockSagaLogs);
      expect(result).toHaveLength(2);
      expect(mockSagaLogWriteRepository.findBySagaStepId).toHaveBeenCalledWith(
        sagaStepId,
      );
      expect(mockSagaLogWriteRepository.findBySagaStepId).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty array when no saga logs exist for saga step', async () => {
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaStepId };
      const query = new FindSagaLogsBySagaStepIdQuery(queryDto);

      mockSagaLogWriteRepository.findBySagaStepId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockSagaLogWriteRepository.findBySagaStepId).toHaveBeenCalledWith(
        sagaStepId,
      );
    });
  });
});
