import { FindSagaInstancesByCriteriaQuery } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query';
import { FindSagaInstanceViewModelByIdQuery } from '@/saga-context/saga-instance/application/queries/tenant-member-find-view-model-by-id/saga-instance-find-view-model-by-id.query';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceFindByCriteriaRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-find-by-criteria.request.dto';
import { SagaInstanceFindByIdRequestDto } from '@/saga-context/saga-instance/transport/graphql/dtos/requests/saga-instance-find-by-id.request.dto';
import { SagaInstanceGraphQLMapper } from '@/saga-context/saga-instance/transport/graphql/mappers/saga-instance.mapper';
import { SagaInstanceQueryResolver } from '@/saga-context/saga-instance/transport/graphql/resolvers/saga-instance-queries.resolver';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';

describe('SagaInstanceQueryResolver', () => {
  let resolver: SagaInstanceQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockSagaInstanceGraphQLMapper: jest.Mocked<SagaInstanceGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockSagaInstanceGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceGraphQLMapper>;

    resolver = new SagaInstanceQueryResolver(
      mockQueryBus,
      mockSagaInstanceGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sagaInstanceFindById', () => {
    it('should return saga instance response dto when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaInstanceFindByIdRequestDto = {
        id: sagaInstanceId,
      };

      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const responseDto = {
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockSagaInstanceGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.sagaInstanceFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaInstanceViewModelByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaInstanceViewModelByIdQuery);
      expect(query.id.value).toBe(input.id);
      expect(mockSagaInstanceGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should return null when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaInstanceFindByIdRequestDto = {
        id: sagaInstanceId,
      };

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await resolver.sagaInstanceFindById(input);

      expect(result).toBeNull();
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaInstanceViewModelByIdQuery),
      );
      expect(
        mockSagaInstanceGraphQLMapper.toResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('sagaInstanceFindByCriteria', () => {
    it('should return paginated saga instance result dto', async () => {
      const input: SagaInstanceFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: {
          page: 1,
          perPage: 10,
        },
      };

      const viewModels: SagaInstanceViewModel[] = [
        new SagaInstanceViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Order Processing Saga',
          status: SagaInstanceStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          updatedAt: new Date('2024-01-01T10:00:00Z'),
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);

      const responseDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Order Processing Saga',
            status: SagaInstanceStatusEnum.PENDING,
            startDate: null,
            endDate: null,
            createdAt: new Date('2024-01-01T10:00:00Z'),
            updatedAt: new Date('2024-01-01T10:00:00Z'),
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaInstanceGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        responseDto,
      );

      const result = await resolver.sagaInstanceFindByCriteria(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaInstancesByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaInstancesByCriteriaQuery);
      expect(
        mockSagaInstanceGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should handle undefined input', async () => {
      const viewModels: SagaInstanceViewModel[] = [];
      const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);

      const responseDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaInstanceGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        responseDto,
      );

      const result = await resolver.sagaInstanceFindByCriteria(undefined);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaInstancesByCriteriaQuery),
      );
    });
  });
});
