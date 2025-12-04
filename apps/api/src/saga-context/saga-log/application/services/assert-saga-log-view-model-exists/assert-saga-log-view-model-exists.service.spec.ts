import { SagaLogNotFoundException } from '@/saga-context/saga-log/application/exceptions/saga-log-not-found/saga-log-not-found.exception';
import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import {
  SAGA_LOG_READ_REPOSITORY_TOKEN,
  SagaLogReadRepository,
} from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SagaLogViewModel } from '@/saga-context/saga-log/domain/view-models/saga-log/saga-log.view-model';
import { SagaLogTypeEnum } from '@/saga-context/saga-log/domain/enums/saga-log-type/saga-log-type.enum';
import { Test } from '@nestjs/testing';

describe('AssertSagaLogViewModelExistsService', () => {
  let service: AssertSagaLogViewModelExistsService;
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
        AssertSagaLogViewModelExistsService,
        {
          provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
          useValue: mockSagaLogReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertSagaLogViewModelExistsService>(
      AssertSagaLogViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return saga log view model when it exists', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const existingViewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.INFO,
        message: 'Test log message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      mockSagaLogReadRepository.findById.mockResolvedValue(existingViewModel);

      const result = await service.execute(sagaLogId);

      expect(result).toBe(existingViewModel);
      expect(mockSagaLogReadRepository.findById).toHaveBeenCalledWith(
        sagaLogId,
      );
      expect(mockSagaLogReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw SagaLogNotFoundException when saga log view model does not exist', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaLogReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(sagaLogId)).rejects.toThrow(
        SagaLogNotFoundException,
      );
      expect(mockSagaLogReadRepository.findById).toHaveBeenCalledWith(
        sagaLogId,
      );
    });

    it('should throw SagaLogNotFoundException with correct message', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaLogReadRepository.findById.mockResolvedValue(null);

      try {
        await service.execute(sagaLogId);
        fail('Should have thrown SagaLogNotFoundException');
      } catch (error) {
        expect(error).toBeInstanceOf(SagaLogNotFoundException);
        expect(error.message).toContain(sagaLogId);
      }
    });

    it('should return view model with all fields populated', async () => {
      const sagaLogId = '123e4567-e89b-12d3-a456-426614174000';
      const existingViewModel = new SagaLogViewModel({
        id: sagaLogId,
        sagaInstanceId: '223e4567-e89b-12d3-a456-426614174000',
        sagaStepId: '323e4567-e89b-12d3-a456-426614174000',
        type: SagaLogTypeEnum.ERROR,
        message: 'Error log message',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      });

      mockSagaLogReadRepository.findById.mockResolvedValue(existingViewModel);

      const result = await service.execute(sagaLogId);

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
