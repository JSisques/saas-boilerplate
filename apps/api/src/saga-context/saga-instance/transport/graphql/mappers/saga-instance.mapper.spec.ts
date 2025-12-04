import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceGraphQLMapper } from '@/saga-context/saga-instance/transport/graphql/mappers/saga-instance.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('SagaInstanceGraphQLMapper', () => {
  let mapper: SagaInstanceGraphQLMapper;

  beforeEach(() => {
    mapper = new SagaInstanceGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should map saga instance view model to response dto with all properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: sagaInstanceId,
        name: viewModel.name,
        status: viewModel.status,
        startDate: startDate,
        endDate: endDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should map saga instance view model with null optional properties', () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: sagaInstanceId,
        name: viewModel.name,
        status: viewModel.status,
        startDate: null,
        endDate: null,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should map paginated result to paginated response dto', () => {
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');

      const viewModels: SagaInstanceViewModel[] = [
        new SagaInstanceViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Order Processing Saga',
          status: SagaInstanceStatusEnum.PENDING,
          startDate: null,
          endDate: null,
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
        new SagaInstanceViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Payment Processing Saga',
          status: SagaInstanceStatusEnum.COMPLETED,
          startDate: new Date('2024-01-01T10:00:00Z'),
          endDate: new Date('2024-01-01T11:00:00Z'),
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Order Processing Saga',
            status: SagaInstanceStatusEnum.PENDING,
            startDate: null,
            endDate: null,
            createdAt: createdAt,
            updatedAt: updatedAt,
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            name: 'Payment Processing Saga',
            status: SagaInstanceStatusEnum.COMPLETED,
            startDate: new Date('2024-01-01T10:00:00Z'),
            endDate: new Date('2024-01-01T11:00:00Z'),
            createdAt: createdAt,
            updatedAt: updatedAt,
          },
        ],
        total: 2,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
    });

    it('should map empty paginated result', () => {
      const paginatedResult = new PaginatedResult([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      });
    });
  });
});
