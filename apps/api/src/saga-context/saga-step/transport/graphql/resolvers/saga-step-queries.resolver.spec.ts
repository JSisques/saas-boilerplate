import { FindSagaStepsByCriteriaQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-by-criteria/saga-step-find-by-criteria.query';
import { FindSagaStepViewModelByIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.query';
import { FindSagaStepViewModelsBySagaInstanceIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-saga-instance-id/saga-step-find-view-model-by-saga-instance-id.query';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepFindByCriteriaRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-find-by-criteria.request.dto';
import { SagaStepFindByIdRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-find-by-id.request.dto';
import { SagaStepFindBySagaInstanceIdRequestDto } from '@/saga-context/saga-step/transport/graphql/dtos/requests/saga-step-find-by-saga-instance-id.request.dto';
import {
  PaginatedSagaStepResultDto,
  SagaStepResponseDto,
} from '@/saga-context/saga-step/transport/graphql/dtos/responses/saga-step.response.dto';
import { SagaStepGraphQLMapper } from '@/saga-context/saga-step/transport/graphql/mappers/saga-step.mapper';
import { SagaStepQueryResolver } from '@/saga-context/saga-step/transport/graphql/resolvers/saga-step-queries.resolver';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';

describe('SagaStepQueryResolver', () => {
  let resolver: SagaStepQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockSagaStepGraphQLMapper: jest.Mocked<SagaStepGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockSagaStepGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<SagaStepGraphQLMapper>;

    resolver = new SagaStepQueryResolver(
      mockQueryBus,
      mockSagaStepGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sagaStepFindById', () => {
    it('should return saga step when found', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepFindByIdRequestDto = {
        id: sagaStepId,
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const responseDto: SagaStepResponseDto = {
        id: sagaStepId,
        sagaInstanceId: viewModel.sagaInstanceId,
        name: viewModel.name,
        order: viewModel.order,
        status: viewModel.status as SagaStepStatusEnum,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: viewModel.retryCount,
        maxRetries: viewModel.maxRetries,
        payload: JSON.stringify({}),
        result: JSON.stringify({}),
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockSagaStepGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.sagaStepFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepViewModelByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaStepViewModelByIdQuery);
      expect(query.id.value).toBe(sagaStepId);
      expect(mockSagaStepGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should return null when saga step not found', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepFindByIdRequestDto = {
        id: sagaStepId,
      };

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await resolver.sagaStepFindById(input);

      expect(result).toBeNull();
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepViewModelByIdQuery),
      );
      expect(mockSagaStepGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });

  describe('sagaStepFindBySagaInstanceId', () => {
    it('should return array of saga steps when found', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepFindBySagaInstanceIdRequestDto = {
        sagaInstanceId: sagaInstanceId,
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModels: SagaStepViewModel[] = [
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
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
        new SagaStepViewModel({
          id: '323e4567-e89b-12d3-a456-426614174001',
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
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const responseDtos: SagaStepResponseDto[] = viewModels.map((vm) => ({
        id: vm.id,
        sagaInstanceId: vm.sagaInstanceId,
        name: vm.name,
        order: vm.order,
        status: vm.status as SagaStepStatusEnum,
        startDate: vm.startDate,
        endDate: vm.endDate,
        errorMessage: vm.errorMessage,
        retryCount: vm.retryCount,
        maxRetries: vm.maxRetries,
        payload: JSON.stringify(vm.payload),
        result: JSON.stringify(vm.result),
        createdAt: vm.createdAt,
        updatedAt: vm.updatedAt,
      }));

      mockQueryBus.execute.mockResolvedValue(viewModels);
      mockSagaStepGraphQLMapper.toResponseDto
        .mockReturnValueOnce(responseDtos[0])
        .mockReturnValueOnce(responseDtos[1]);

      const result = await resolver.sagaStepFindBySagaInstanceId(input);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(responseDtos[0]);
      expect(result[1]).toBe(responseDtos[1]);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepViewModelsBySagaInstanceIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaStepViewModelsBySagaInstanceIdQuery);
      expect(query.sagaInstanceId.value).toBe(sagaInstanceId);
      expect(mockSagaStepGraphQLMapper.toResponseDto).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no saga steps found', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const input: SagaStepFindBySagaInstanceIdRequestDto = {
        sagaInstanceId: sagaInstanceId,
      };

      mockQueryBus.execute.mockResolvedValue([]);

      const result = await resolver.sagaStepFindBySagaInstanceId(input);

      expect(result).toEqual([]);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepViewModelsBySagaInstanceIdQuery),
      );
      expect(mockSagaStepGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });

  describe('sagaStepFindByCriteria', () => {
    it('should return paginated saga steps when criteria matches', async () => {
      const input: SagaStepFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModels: SagaStepViewModel[] = [
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
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedSagaStepResultDto = {
        items: [
          {
            id: viewModels[0].id,
            sagaInstanceId: viewModels[0].sagaInstanceId,
            name: viewModels[0].name,
            order: viewModels[0].order,
            status: viewModels[0].status as SagaStepStatusEnum,
            startDate: null,
            endDate: null,
            errorMessage: null,
            retryCount: viewModels[0].retryCount,
            maxRetries: viewModels[0].maxRetries,
            payload: JSON.stringify({}),
            result: JSON.stringify({}),
            createdAt: createdAt,
            updatedAt: updatedAt,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaStepGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.sagaStepFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaStepsByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockSagaStepGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return paginated saga steps when input is undefined', async () => {
      const viewModels: SagaStepViewModel[] = [];
      const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);
      const paginatedResponseDto: PaginatedSagaStepResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaStepGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.sagaStepFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaStepsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockSagaStepGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should handle criteria with filters and sorts', async () => {
      const input: SagaStepFindByCriteriaRequestDto = {
        filters: [
          {
            field: 'status',
            operator: 'eq' as any,
            value: SagaStepStatusEnum.PENDING,
          },
        ],
        sorts: [{ field: 'order', direction: 'ASC' as any }],
        pagination: { page: 1, perPage: 10 },
      };

      const paginatedResult = new PaginatedResult<SagaStepViewModel>(
        [],
        0,
        1,
        10,
      );
      const paginatedResponseDto: PaginatedSagaStepResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaStepGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      await resolver.sagaStepFindByCriteria(input);

      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query.criteria).toBeInstanceOf(Criteria);
    });
  });
});
