import { FindSagaLogsByCriteriaQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.query';
import { FindSagaLogViewModelByIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.query';
import { FindSagaLogViewModelsBySagaInstanceIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.query';
import { FindSagaLogViewModelsBySagaStepIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.query';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogFindByCriteriaRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-criteria.request.dto';
import { SagaLogFindByIdRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-id.request.dto';
import { SagaLogFindBySagaInstanceIdRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-saga-instance-id.request.dto';
import { SagaLogFindBySagaStepIdRequestDto } from '@/saga-context/saga-log/transport/graphql/dtos/requests/saga-log-find-by-saga-step-id.request.dto';
import {
  PaginatedSagaLogResultDto,
  SagaLogResponseDto,
} from '@/saga-context/saga-log/transport/graphql/dtos/responses/saga-log.response.dto';
import { SagaLogGraphQLMapper } from '@/saga-context/saga-log/transport/graphql/mappers/saga-log.mapper';
import { SagaLogQueryResolver } from '@/saga-context/saga-log/transport/graphql/resolvers/saga-log-queries.resolver';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';

describe('SagaLogQueryResolver', () => {
  let resolver: SagaLogQueryResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockSagaLogGraphQLMapper: jest.Mocked<SagaLogGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockSagaLogGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<SagaLogGraphQLMapper>;

    resolver = new SagaLogQueryResolver(mockQueryBus, mockSagaLogGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sagaLogFindById', () => {
    it('should return saga log when found', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogFindByIdRequestDto = {
        id: sagaLogId,
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const responseDto: SagaLogResponseDto = {
        id: sagaLogId,
        sagaInstanceId: viewModel.sagaInstanceId,
        sagaStepId: viewModel.sagaStepId,
        type: viewModel.type as any,
        message: viewModel.message,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockSagaLogGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.sagaLogFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaLogViewModelByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaLogViewModelByIdQuery);
      expect(query.id.value).toBe(sagaLogId);
      expect(mockSagaLogGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should return null when saga log not found', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogFindByIdRequestDto = {
        id: sagaLogId,
      };

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await resolver.sagaLogFindById(input);

      expect(result).toBeNull();
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaLogViewModelByIdQuery),
      );
      expect(mockSagaLogGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });

  describe('sagaLogFindBySagaInstanceId', () => {
    it('should return array of saga logs when found', async () => {
      const sagaInstanceId = '223e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogFindBySagaInstanceIdRequestDto = {
        sagaInstanceId: sagaInstanceId,
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModels: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
        new SagaLogViewModel({
          id: '323e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: sagaInstanceId,
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.ERROR,
          message: 'Log message 2',
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const responseDtos: SagaLogResponseDto[] = viewModels.map((vm) => ({
        id: vm.id,
        sagaInstanceId: vm.sagaInstanceId,
        sagaStepId: vm.sagaStepId,
        type: vm.type as any,
        message: vm.message,
        createdAt: vm.createdAt,
        updatedAt: vm.updatedAt,
      }));

      mockQueryBus.execute.mockResolvedValue(viewModels);
      viewModels.forEach((vm, index) => {
        mockSagaLogGraphQLMapper.toResponseDto.mockReturnValueOnce(
          responseDtos[index],
        );
      });

      const result = await resolver.sagaLogFindBySagaInstanceId(input);

      expect(result).toHaveLength(2);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaLogViewModelsBySagaInstanceIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaLogViewModelsBySagaInstanceIdQuery);
      expect(query.sagaInstanceId.value).toBe(sagaInstanceId);
      expect(mockSagaLogGraphQLMapper.toResponseDto).toHaveBeenCalledTimes(2);
    });
  });

  describe('sagaLogFindBySagaStepId', () => {
    it('should return array of saga logs when found', async () => {
      const sagaStepId = '323e4567-e89b-12d3-a456-426614174000';
      const input: SagaLogFindBySagaStepIdRequestDto = {
        sagaStepId: sagaStepId,
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModels: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: sagaStepId,
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const responseDtos: SagaLogResponseDto[] = viewModels.map((vm) => ({
        id: vm.id,
        sagaInstanceId: vm.sagaInstanceId,
        sagaStepId: vm.sagaStepId,
        type: vm.type as any,
        message: vm.message,
        createdAt: vm.createdAt,
        updatedAt: vm.updatedAt,
      }));

      mockQueryBus.execute.mockResolvedValue(viewModels);
      viewModels.forEach((vm, index) => {
        mockSagaLogGraphQLMapper.toResponseDto.mockReturnValueOnce(
          responseDtos[index],
        );
      });

      const result = await resolver.sagaLogFindBySagaStepId(input);

      expect(result).toHaveLength(1);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaLogViewModelsBySagaStepIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaLogViewModelsBySagaStepIdQuery);
      expect(query.sagaStepId.value).toBe(sagaStepId);
      expect(mockSagaLogGraphQLMapper.toResponseDto).toHaveBeenCalledTimes(1);
    });
  });

  describe('sagaLogFindByCriteria', () => {
    it('should return paginated result when found', async () => {
      const input: SagaLogFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModels: SagaLogViewModel[] = [
        new SagaLogViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.INFO,
          message: 'Log message 1',
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedSagaLogResultDto = {
        items: viewModels.map((vm) => ({
          id: vm.id,
          sagaInstanceId: vm.sagaInstanceId,
          sagaStepId: vm.sagaStepId,
          type: vm.type as any,
          message: vm.message,
          createdAt: vm.createdAt,
          updatedAt: vm.updatedAt,
        })),
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaLogGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.sagaLogFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaLogsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindSagaLogsByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockSagaLogGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should handle undefined input', async () => {
      const viewModels: SagaLogViewModel[] = [];

      const paginatedResult = new PaginatedResult(viewModels, 0, 1, 10);
      const paginatedResponseDto: PaginatedSagaLogResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockSagaLogGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.sagaLogFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindSagaLogsByCriteriaQuery),
      );
    });
  });
});
