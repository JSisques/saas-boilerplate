import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepGraphQLMapper } from '@/saga-context/saga-step/transport/graphql/mappers/saga-step.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('SagaStepGraphQLMapper', () => {
  let mapper: SagaStepGraphQLMapper;

  beforeEach(() => {
    mapper = new SagaStepGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should map saga step view model to response dto with all properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.COMPLETED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: { orderId: '12345' },
        result: { success: true },
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: sagaStepId,
        sagaInstanceId: viewModel.sagaInstanceId,
        name: viewModel.name,
        order: viewModel.order,
        status: viewModel.status,
        startDate: startDate,
        endDate: endDate,
        errorMessage: null,
        retryCount: 2,
        maxRetries: 5,
        payload: JSON.stringify({ orderId: '12345' }),
        result: JSON.stringify({ success: true }),
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should map saga step view model with null optional properties', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: sagaStepId,
        sagaInstanceId: viewModel.sagaInstanceId,
        name: viewModel.name,
        order: viewModel.order,
        status: viewModel.status,
        startDate: null,
        endDate: null,
        errorMessage: null,
        retryCount: 0,
        maxRetries: 3,
        payload: JSON.stringify({}),
        result: JSON.stringify({}),
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should map saga step view model with null payload and result', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
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
        payload: null as any,
        result: null as any,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result.payload).toBeNull();
      expect(result.result).toBeNull();
    });

    it('should map saga step view model with error message', () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');

      const viewModel = new SagaStepViewModel({
        id: sagaStepId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Process Payment',
        order: 1,
        status: SagaStepStatusEnum.FAILED,
        startDate: startDate,
        endDate: endDate,
        errorMessage: 'Payment processing failed',
        retryCount: 3,
        maxRetries: 3,
        payload: { orderId: '12345' },
        result: {},
        createdAt: createdAt,
        updatedAt: updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result.errorMessage).toBe('Payment processing failed');
      expect(result.status).toBe(SagaStepStatusEnum.FAILED);
      expect(result.retryCount).toBe(3);
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should map paginated result to paginated response dto', () => {
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
        new SagaStepViewModel({
          id: '323e4567-e89b-12d3-a456-426614174001',
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
          createdAt: createdAt,
          updatedAt: updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0].id).toBe(viewModels[0].id);
      expect(result.items[1].id).toBe(viewModels[1].id);
    });

    it('should map empty paginated result', () => {
      const paginatedResult = new PaginatedResult<SagaStepViewModel>(
        [],
        0,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should calculate totalPages correctly', () => {
      const viewModels: SagaStepViewModel[] = Array.from(
        { length: 25 },
        (_, i) =>
          new SagaStepViewModel({
            id: `123e4567-e89b-12d3-a456-42661417400${i}`,
            sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
            name: `Step ${i}`,
            order: i,
            status: SagaStepStatusEnum.PENDING,
            startDate: null,
            endDate: null,
            errorMessage: null,
            retryCount: 0,
            maxRetries: 3,
            payload: {},
            result: {},
            createdAt: new Date('2024-01-01T10:00:00Z'),
            updatedAt: new Date('2024-01-01T11:00:00Z'),
          }),
      );

      const paginatedResult = new PaginatedResult(viewModels, 25, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.total).toBe(25);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(3); // Math.ceil(25/10) = 3
    });
  });
});
