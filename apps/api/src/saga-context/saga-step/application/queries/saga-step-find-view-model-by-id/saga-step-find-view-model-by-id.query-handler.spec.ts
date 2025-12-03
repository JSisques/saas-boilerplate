import { FindSagaStepViewModelByIdQuery } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.query';
import { FindSagaStepViewModelByIdQueryHandler } from '@/saga-context/saga-step/application/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.query-handler';
import { AssertSagaStepViewModelExsistsService } from '@/saga-context/saga-step/application/services/assert-saga-step-view-model-exsits/assert-saga-step-view-model-exsits.service';
import { SagaStepViewModel } from '@/saga-context/saga-step/domain/view-models/saga-step/saga-step.view-model';
import { SagaStepStatusEnum } from '@/saga-context/saga-step/domain/enums/saga-step-status/saga-step-status.enum';
import { SagaStepNotFoundException } from '@/saga-context/saga-step/application/exceptions/saga-step-not-found/saga-step-not-found.exception';
import { Test } from '@nestjs/testing';

describe('FindSagaStepViewModelByIdQueryHandler', () => {
  let handler: FindSagaStepViewModelByIdQueryHandler;
  let mockAssertSagaStepViewModelExsistsService: jest.Mocked<AssertSagaStepViewModelExsistsService>;

  beforeEach(async () => {
    mockAssertSagaStepViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaStepViewModelExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaStepViewModelByIdQueryHandler,
        {
          provide: AssertSagaStepViewModelExsistsService,
          useValue: mockAssertSagaStepViewModelExsistsService,
        },
      ],
    }).compile();

    handler = module.get<FindSagaStepViewModelByIdQueryHandler>(
      FindSagaStepViewModelByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return saga step view model when saga step exists', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaStepId };
      const query = new FindSagaStepViewModelByIdQuery(queryDto);

      const mockViewModel = new SagaStepViewModel({
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
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockAssertSagaStepViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(sagaStepId);
      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaStepNotFoundException when saga step does not exist', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaStepId };
      const query = new FindSagaStepViewModelByIdQuery(queryDto);

      const error = new SagaStepNotFoundException(sagaStepId);
      mockAssertSagaStepViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(query)).rejects.toThrow(
        SagaStepNotFoundException,
      );
      expect(
        mockAssertSagaStepViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(sagaStepId);
    });

    it('should return view model with all fields populated', async () => {
      const sagaStepId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaStepId };
      const query = new FindSagaStepViewModelByIdQuery(queryDto);

      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const mockViewModel = new SagaStepViewModel({
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
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      });

      mockAssertSagaStepViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result.id).toBe(sagaStepId);
      expect(result.name).toBe('Process Payment');
      expect(result.status).toBe(SagaStepStatusEnum.COMPLETED);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.retryCount).toBe(2);
      expect(result.maxRetries).toBe(5);
    });
  });
});
