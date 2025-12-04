import { AssertSagaInstanceViewModelExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exsits/assert-saga-instance-view-model-exsits.service';
import { SagaInstanceNotFoundException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-not-found/saga-instance-not-found.exception';
import {
  SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
  SagaInstanceReadRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('AssertSagaInstanceViewModelExsistsService', () => {
  let service: AssertSagaInstanceViewModelExsistsService;
  let mockSagaInstanceReadRepository: jest.Mocked<SagaInstanceReadRepository>;

  beforeEach(async () => {
    mockSagaInstanceReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertSagaInstanceViewModelExsistsService,
        {
          provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertSagaInstanceViewModelExsistsService>(
      AssertSagaInstanceViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return saga instance view model when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const viewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: SagaInstanceStatusEnum.PENDING,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockSagaInstanceReadRepository.findById.mockResolvedValue(viewModel);

      const result = await service.execute(sagaInstanceId);

      expect(result).toBe(viewModel);
      expect(mockSagaInstanceReadRepository.findById).toHaveBeenCalledWith(
        sagaInstanceId,
      );
    });

    it('should throw SagaInstanceNotFoundException when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaInstanceReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(sagaInstanceId)).rejects.toThrow(
        SagaInstanceNotFoundException,
      );
      expect(mockSagaInstanceReadRepository.findById).toHaveBeenCalledWith(
        sagaInstanceId,
      );
    });
  });
});
