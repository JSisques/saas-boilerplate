import { FindSagaLogsByCriteriaQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.query';
import { FindSagaLogsByCriteriaQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.query-handler';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Criteria } from '@/shared/domain/entities/criteria';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('FindSagaLogsByCriteriaQueryHandler', () => {
  let handler: FindSagaLogsByCriteriaQueryHandler;
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
        FindSagaLogsByCriteriaQueryHandler,
        {
          provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
          useValue: mockSagaLogReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogsByCriteriaQueryHandler>(
      FindSagaLogsByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result with saga logs when criteria matches', async () => {
      const criteria = new Criteria();
      const queryDto = { criteria };
      const query = new FindSagaLogsByCriteriaQuery(queryDto);

      const mockSagaLogs: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Test log message 1',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
        new SagaLogViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.ERROR,
          message: 'Test log message 2',
          createdAt: new Date('2024-01-01T11:00:00Z'),
          updatedAt: new Date('2024-01-01T11:00:00Z'),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(mockSagaLogs, 2, 1, 10);

      mockSagaLogReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockSagaLogReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockSagaLogReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no saga logs match criteria', async () => {
      const criteria = new Criteria();
      const queryDto = { criteria };
      const query = new FindSagaLogsByCriteriaQuery(queryDto);

      const mockPaginatedResult = new PaginatedResult([], 0, 1, 10);

      mockSagaLogReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockSagaLogReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });

    it('should handle pagination correctly', async () => {
      const criteria = new Criteria([], [], { page: 2, perPage: 5 });
      const queryDto = { criteria };
      const query = new FindSagaLogsByCriteriaQuery(queryDto);

      const mockSagaLogs: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Test log message',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(mockSagaLogs, 10, 2, 5);

      mockSagaLogReadRepository.findByCriteria.mockResolvedValue(
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
