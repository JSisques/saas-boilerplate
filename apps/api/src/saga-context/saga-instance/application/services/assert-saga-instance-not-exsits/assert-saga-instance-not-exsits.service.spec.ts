import { AssertSagaInstanceNotExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-not-exsits/assert-saga-instance-not-exsits.service';
import { SagaInstanceAlreadyExistsException } from '@/saga-context/saga-instance/application/exceptions/saga-instance-already-exists/saga-instance-already-exists.exception';
import { SagaInstanceAggregate } from '@/saga-context/saga-instance/domain/aggregates/saga-instance.aggregate';
import {
  SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
  SagaInstanceWriteRepository,
} from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { SagaInstanceUuidValueObject } from '@/shared/domain/value-objects/identifiers/saga-instance-uuid/saga-instance-uuid.vo';
import { SagaInstanceNameValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-name/saga-instance-name.vo';
import { SagaInstanceStatusValueObject } from '@/saga-context/saga-instance/domain/value-objects/saga-instance-status/saga-instance-status.vo';
import { SagaInstanceStatusEnum } from '@/saga-context/saga-instance/domain/enums/saga-instance-status/saga-instance-status.enum';
import { Test } from '@nestjs/testing';

describe('AssertSagaInstanceNotExsistsService', () => {
  let service: AssertSagaInstanceNotExsistsService;
  let mockSagaInstanceWriteRepository: jest.Mocked<SagaInstanceWriteRepository>;

  beforeEach(async () => {
    mockSagaInstanceWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SagaInstanceWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertSagaInstanceNotExsistsService,
        {
          provide: SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
          useValue: mockSagaInstanceWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertSagaInstanceNotExsistsService>(
      AssertSagaInstanceNotExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return void when saga instance does not exist', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';

      mockSagaInstanceWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(sagaInstanceId)).resolves.toBeUndefined();
      expect(mockSagaInstanceWriteRepository.findById).toHaveBeenCalledWith(
        sagaInstanceId,
      );
    });

    it('should throw SagaInstanceAlreadyExistsException when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const sagaInstance = new SagaInstanceAggregate(
        {
          id: new SagaInstanceUuidValueObject(sagaInstanceId),
          name: new SagaInstanceNameValueObject('Order Processing Saga'),
          status: new SagaInstanceStatusValueObject(
            SagaInstanceStatusEnum.PENDING,
          ),
          startDate: null,
          endDate: null,
          createdAt: new DateValueObject(new Date()),
          updatedAt: new DateValueObject(new Date()),
        },
        false,
      );

      mockSagaInstanceWriteRepository.findById.mockResolvedValue(sagaInstance);

      await expect(service.execute(sagaInstanceId)).rejects.toThrow(
        SagaInstanceAlreadyExistsException,
      );
      expect(mockSagaInstanceWriteRepository.findById).toHaveBeenCalledWith(
        sagaInstanceId,
      );
    });
  });
});
