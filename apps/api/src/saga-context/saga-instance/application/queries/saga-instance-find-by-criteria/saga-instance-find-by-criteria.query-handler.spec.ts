import { FindSagaInstancesByCriteriaQuery } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query';
import { FindSagaInstancesByCriteriaQueryHandler } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query-handler';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Criteria } from '@/shared/domain/entities/criteria';
import { Test } from '@nestjs/testing';

describe('FindSagaInstancesByCriteriaQueryHandler', () => {
  let handler: FindSagaInstancesByCriteriaQueryHandler;
  let mockSagaInstanceReadRepository: jest.Mocked<SagaInstanceReadRepository>;

  beforeEach(async () => {
    mockSagaInstanceReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaInstancesByCriteriaQueryHandler,
        {
          provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaInstancesByCriteriaQueryHandler>(
      FindSagaInstancesByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result of saga instance view models', async () => {
      const criteria = new Criteria();
      const query = new FindSagaInstancesByCriteriaQuery({ criteria });

      const mockViewModels: SagaInstanceViewModel[] = [
        new SagaInstanceViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Order Processing Saga',
          status: 'PENDING',
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new SagaInstanceViewModel({
          id: '223e4567-e89b-12d3-a456-426614174000',
          name: 'Payment Processing Saga',
          status: 'COMPLETED',
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(mockViewModels, 2, 1, 10);

      mockSagaInstanceReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(
        mockSagaInstanceReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
    });

    it('should return empty paginated result when no saga instances match criteria', async () => {
      const criteria = new Criteria();
      criteria.pagination.page = 2;
      criteria.pagination.perPage = 5;
      const query = new FindSagaInstancesByCriteriaQuery({ criteria });

      const mockPaginatedResult = new PaginatedResult([], 0, 2, 5);

      mockSagaInstanceReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(
        mockSagaInstanceReadRepository.findByCriteria,
      ).toHaveBeenCalledWith(criteria);
    });
  });
});
