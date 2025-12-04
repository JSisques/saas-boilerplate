import { FindSagaStepViewModelsBySagaInstanceIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-saga-instance-id/saga-step-find-view-model-by-saga-instance-id.query';
import { FindSagaStepViewModelsBySagaInstanceIdQueryHandler } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-saga-instance-id/saga-step-find-view-model-by-saga-instance-id.query-handler';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('FindSagaStepViewModelsBySagaInstanceIdQueryHandler', () => {
  let handler: FindSagaStepViewModelsBySagaInstanceIdQueryHandler;
  let mockSagaStepReadRepository: jest.Mocked<SagaStepReadRepository>;

  beforeEach(async () => {
    mockSagaStepReadRepository = {
      findById: jest.fn(),
      findBySagaInstanceId: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaStepReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaStepViewModelsBySagaInstanceIdQueryHandler,
        {
          provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
          useValue: mockSagaStepReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaStepViewModelsBySagaInstanceIdQueryHandler>(
      FindSagaStepViewModelsBySagaInstanceIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return array of saga step view models when saga steps exist', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaStepViewModelsBySagaInstanceIdQuery(queryDto);

      const mockViewModels: SagaStepViewModel[] = [
        new SagaStepViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          name: 'Process Payment',
          order: 1,
          status: SagaStepStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaStepViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          name: 'Send Email',
          order: 2,
          status: SagaStepStatusEnum.COMPLETED,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
        }),
      ];

      mockSagaStepReadRepository.findBySagaInstanceId.mockResolvedValue(
        mockViewModels,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModels);
      expect(result).toHaveLength(2);
      expect(result[0].sagaInstanceId).toBe(sagaInstanceId);
      expect(result[1].sagaInstanceId).toBe(sagaInstanceId);
      expect(
        mockSagaStepReadRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
      expect(
        mockSagaStepReadRepository.findBySagaInstanceId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no saga steps exist for saga instance', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaStepViewModelsBySagaInstanceIdQuery(queryDto);

      mockSagaStepReadRepository.findBySagaInstanceId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(
        mockSagaStepReadRepository.findBySagaInstanceId,
      ).toHaveBeenCalledWith(sagaInstanceId);
    });

    it('should return view models with different statuses', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const queryDto = { sagaInstanceId };
      const query = new FindSagaStepViewModelsBySagaInstanceIdQuery(queryDto);

      const mockViewModels: SagaStepViewModel[] = [
        new SagaStepViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          name: 'Step 1',
          order: 1,
          status: SagaStepStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaStepViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          name: 'Step 2',
          order: 2,
          status: SagaStepStatusEnum.RUNNING,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: null,
          errorMessage: null,
          retryCount: 0,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaStepViewModel({
          id: '323e4567-e89b-12d3-a456-426614174002',
          sagaInstanceId: sagaInstanceId,
          name: 'Step 3',
          order: 3,
          status: SagaStepStatusEnum.FAILED,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          errorMessage: 'Processing failed',
          retryCount: 3,
          maxRetries: 3,
          payload: {},
          result: {},
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
        }),
      ];

      mockSagaStepReadRepository.findBySagaInstanceId.mockResolvedValue(
        mockViewModels,
      );

      const result = await handler.execute(query);

      expect(result).toHaveLength(3);
      expect(result[0].status).toBe(SagaStepStatusEnum.PENDING);
      expect(result[1].status).toBe(SagaStepStatusEnum.RUNNING);
      expect(result[2].status).toBe(SagaStepStatusEnum.FAILED);
      expect(result[2].errorMessage).toBe('Processing failed');
    });
  });
});
