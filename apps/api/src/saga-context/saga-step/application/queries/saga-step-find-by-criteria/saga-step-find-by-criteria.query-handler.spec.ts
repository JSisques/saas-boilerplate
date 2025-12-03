import { FindSagaStepsByCriteriaQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-by-criteria/saga-step-find-by-criteria.query';
import { FindSagaStepsByCriteriaQueryHandler } from '@/saga-context/saga-step/application/queries/saga-step-find-by-criteria/saga-step-find-by-criteria.query-handler';
import {
  SAGA_STEP_READ_REPOSITORY_TOKEN,
  SagaStepReadRepository,
} from '@/saga-context/saga-step/domain/repositories/saga-step-read.repository';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Criteria } from '@/shared/domain/entities/criteria';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { Test } from '@nestjs/testing';

describe('FindSagaStepsByCriteriaQueryHandler', () => {
  let handler: FindSagaStepsByCriteriaQueryHandler;
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
        FindSagaStepsByCriteriaQueryHandler,
        {
          provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
          useValue: mockSagaStepReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaStepsByCriteriaQueryHandler>(
      FindSagaStepsByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result with saga steps when criteria matches', async () => {
      const criteria = new Criteria();
      const queryDto = { criteria };
      const query = new FindSagaStepsByCriteriaQuery(queryDto);

      const mockSagaSteps: SagaStepViewModel[] = [
        new SagaStepViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
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
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
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

      const mockPaginatedResult = new PaginatedResult(mockSagaSteps, 2, 1, 10);

      mockSagaStepReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockSagaStepReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockSagaStepReadRepository.findByCriteria).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty paginated result when no saga steps match criteria', async () => {
      const criteria = new Criteria();
      const queryDto = { criteria };
      const query = new FindSagaStepsByCriteriaQuery(queryDto);

      const mockPaginatedResult = new PaginatedResult([], 0, 1, 10);

      mockSagaStepReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockSagaStepReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 5 });
      const queryDto = { criteria };
      const query = new FindSagaStepsByCriteriaQuery(queryDto);

      const mockSagaSteps: SagaStepViewModel[] = [
        new SagaStepViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
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
      ];

      const mockPaginatedResult = new PaginatedResult(mockSagaSteps, 10, 2, 5);

      mockSagaStepReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result.page).toBe(2);
      expect(result.perPage).toBe(5);
      expect(result.total).toBe(10);
      expect(result.items).toHaveLength(1);
    });
  });
});
