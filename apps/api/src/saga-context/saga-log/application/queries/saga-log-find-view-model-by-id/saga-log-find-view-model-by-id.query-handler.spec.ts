import { FindSagaLogViewModelByIdQuery } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.query';
import { FindSagaLogViewModelByIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.query-handler';
import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { SagaLogNotFoundException } from '@/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import { Test } from '@nestjs/testing';

describe('FindSagaLogViewModelByIdQueryHandler', () => {
  let handler: FindSagaLogViewModelByIdQueryHandler;
  let mockAssertSagaLogViewModelExistsService: jest.Mocked<AssertSagaLogViewModelExistsService>;

  beforeEach(async () => {
    mockAssertSagaLogViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaLogViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaLogViewModelByIdQueryHandler,
        {
          provide: AssertSagaLogViewModelExistsService,
          useValue: mockAssertSagaLogViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<FindSagaLogViewModelByIdQueryHandler>(
      FindSagaLogViewModelByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return saga log view model when saga log exists', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaLogId };
      const query = new FindSagaLogViewModelByIdQuery(queryDto);

      const mockViewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockAssertSagaLogViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertSagaLogViewModelExistsService.execute,
      ).toHaveBeenCalledWith(sagaLogId);
      expect(
        mockAssertSagaLogViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaLogNotFoundException when saga log does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaLogId };
      const query = new FindSagaLogViewModelByIdQuery(queryDto);

      const error = new SagaLogNotFoundException(sagaLogId);
      mockAssertSagaLogViewModelExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(
        SagaLogNotFoundException,
      );
      expect(
        mockAssertSagaLogViewModelExistsService.execute,
      ).toHaveBeenCalledWith(sagaLogId);
    });

    it('should return view model with all fields populated', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaLogId };
      const query = new FindSagaLogViewModelByIdQuery(queryDto);

      const mockViewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.ERROR,
        message: 'Error log message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      });

      mockAssertSagaLogViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result.id).toBe(sagaLogId);
      expect(result.sagaInstanceId).toBe(
        '223e4567-e89b-12d3-a456-426614174000',
      );
      expect(result.sagaStepId).toBe('323e4567-e89b-12d3-a456-426614174000');
      expect(result.type).toBe(SagaLogTypeEnum.ERROR);
      expect(result.message).toBe('Error log message');
    });
  });
});
