import { FindSagaLogViewModelsBySagaInstanceIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.query';
import { FindSagaLogViewModelsBySagaInstanceIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.query-handler';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('FindSagaLogViewModelsBySagaInstanceIdQueryHandler', () => {
  let handler: FindSagaLogViewModelsBySagaInstanceIdQueryHandler;
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
        FindSagaLogViewModelsBySagaInstanceIdQueryHandler,
        {
          provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
          useValue: mockSagaLogReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogViewModelsBySagaInstanceIdQueryHandler>(
      FindSagaLogViewModelsBySagaInstanceIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return array of saga log view models when saga logs exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaLogViewModelsBySagaInstanceIdQuery(queryDto);

      const mockViewModels: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaLogViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.ERROR,
          message: 'Log message 2',
          createdAt: new Date('2024-01-01T11:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
        }),
      ];

      mockSagaLogReadRepository.findBySagaInstanceId.mockResolvedValue(
        mockViewModels,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModels);
      expect(result).toHaveLength(2);
      expect(result[0].sagaInstanceId).toBe(sagaInstanceId);
      expect(result[1].sagaInstanceId).toBe(sagaInstanceId);
      expect(
        mockSagaLogReadRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
      expect(
        mockSagaLogReadRepository.findBySagaInstanceId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no saga logs exist for saga instance', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaLogViewModelsBySagaInstanceIdQuery(queryDto);

      mockSagaLogReadRepository.findBySagaInstanceId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(
        mockSagaLogReadRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
    });

    it('should return view models with different log types', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaLogViewModelsBySagaInstanceIdQuery(queryDto);

      const mockViewModels: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Info message',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaLogViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.WARNING,
          message: 'Warning message',
          createdAt: new Date('2024-01-01T11:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
        }),
        new SagaLogViewModel({
          id: '323e4567-e89b-12d3-a456-426614174002',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.ERROR,
          message: 'Error message',
          createdAt: new Date('2024-01-01T12:00:00Z'),
          updatedAt: new Date('2024-01-01T12:00:00Z'),
        }),
      ];

      mockSagaLogReadRepository.findBySagaInstanceId.mockResolvedValue(
        mockViewModels,
      );

      const result = await handler.execute(query);

      expect(result).toHaveLength(3);
      expect(result[0].type).toBe(SagaLogTypeEnum.INFO);
      expect(result[1].type).toBe(SagaLogTypeEnum.WARNING);
      expect(result[2].type).toBe(SagaLogTypeEnum.ERROR);
    });
  });
});
