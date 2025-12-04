import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogGraphQLMapper } from '@/saga-context/saga-log/transport/graphql/mappers/saga-log.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('SagaLogGraphQLMapper', () => {
  let mapper: SagaLogGraphQLMapper;

  beforeEach(() => {
    mapper = new SagaLogGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should map saga log view model to response dto with all properties', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: sagaLogId,
        sagaInstanceId: viewModel.sagaInstanceId,
        sagaStepId: viewModel.sagaStepId,
        type: viewModel.type,
        message: viewModel.message,
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    });

    it('should map saga log view model with different log types', () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const types = [
        SagaLogTypeEnum.INFO,
        SagaLogTypeEnum.WARNING,
        SagaLogTypeEnum.ERROR,
        SagaLogTypeEnum.DEBUG,
      ];

      types.forEach((type) => {
        const viewModel = new SagaLogViewModel({
          id: sagaLogId,
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: type,
          message: `Test message for ${type}`,
          createdAt: createdAt,
          updatedAt: updatedAt,
        });

        const result = mapper.toResponseDto(viewModel);

        expect(result.type).toBe(type);
        expect(result.message).toBe(`Test message for ${type}`);
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should map paginated result to paginated response dto', () => {
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
        new SagaLogViewModel({
          id: '323e4567-e89b-12d3-a456-426614174001',
          sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
          sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
          type: SagaLogTypeEnum.ERROR,
          message: 'Log message 2',
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
      const paginatedResult = new PaginatedResult<SagaLogViewModel>(
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
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-01T11:00:00Z');
      const viewModels: SagaLogViewModel[] = Array.from(
        { length: 25 },
        (_, i) =>
          new SagaLogViewModel({
            id: `123e4567-e89b-12d3-a456-42661417400${i}`,
            sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
            sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
            type: SagaLogTypeEnum.INFO,
            message: `Log message ${i}`,
            createdAt: createdAt,
            updatedAt: updatedAt,
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
