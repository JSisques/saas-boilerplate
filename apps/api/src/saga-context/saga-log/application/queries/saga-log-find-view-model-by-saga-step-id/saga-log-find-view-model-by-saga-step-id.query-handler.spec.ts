import { FindSagaLogViewModelsBySagaStepIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.query';
import { FindSagaLogViewModelsBySagaStepIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.query-handler';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('FindSagaLogViewModelsBySagaStepIdQueryHandler', () => {
  let handler: FindSagaLogViewModelsBySagaStepIdQueryHandler;
  let mockSagaLogReadRepository: jest.Mocked<SagaLogReadRepository>;

  beforeEach(async () => {
    mockSagaLogReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findBySagaStepId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaLogReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaLogViewModelsBySagaStepIdQueryHandler,
        {
          provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
          useValue: mockSagaLogReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogViewModelsBySagaStepIdQueryHandler>(
      FindSagaLogViewModelsBySagaStepIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return array of saga log view models when saga logs exist', async () => {
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaStepId };
      const query = new FindSagaLogViewModelsBySagaStepIdQuery(queryDto);

      const mockViewModels: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: sagaStepId,
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaLogViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: sagaStepId,
          type: SagaLogTypeEnum.ERROR,
          message: 'Log message 2',
          createdAt: new Date('2024-01-01T11:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
        }),
      ];

      mockSagaLogReadRepository.findBySagaStepId.mockResolvedValue(
        mockViewModels,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModels);
      expect(result).toHaveLength(2);
      expect(result[0].sagaStepId).toBe(sagaStepId);
      expect(result[1].sagaStepId).toBe(sagaStepId);
      expect(mockSagaLogReadRepository.findBySagaStepId).toHaveBeenCalledWith(
        sagaStepId,
      );
      expect(mockSagaLogReadRepository.findBySagaStepId).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty array when no saga logs exist for saga step', async () => {
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaStepId };
      const query = new FindSagaLogViewModelsBySagaStepIdQuery(queryDto);

      mockSagaLogReadRepository.findBySagaStepId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockSagaLogReadRepository.findBySagaStepId).toHaveBeenCalledWith(
        sagaStepId,
      );
    });
  });
});
