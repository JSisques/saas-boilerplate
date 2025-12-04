import { FindSagaInstanceViewModelByIdQuery } from '@/saga-context/saga-instance/application/queries/tenant-member-find-view-model-by-id/saga-instance-find-view-model-by-id.query';
import { FindSagaInstanceViewModelByIdQueryHandler } from '@/saga-context/saga-instance/application/queries/tenant-member-find-view-model-by-id/saga-instance-find-view-model-by-id.query-handler';
import { AssertSagaInstanceViewModelExsistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exsits/assert-saga-instance-view-model-exsits.service';
import { SagaInstanceViewModel } from '@/saga-context/saga-instance/domain/view-models/saga-instance/saga-instance.view-model';
import { Test } from '@nestjs/testing';

describe('FindSagaInstanceViewModelByIdQueryHandler', () => {
  let handler: FindSagaInstanceViewModelByIdQueryHandler;
  let mockAssertSagaInstanceViewModelExsistsService: jest.Mocked<AssertSagaInstanceViewModelExsistsService>;

  beforeEach(async () => {
    mockAssertSagaInstanceViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertSagaInstanceViewModelExsistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindSagaInstanceViewModelByIdQueryHandler,
        {
          provide: AssertSagaInstanceViewModelExsistsService,
          useValue: mockAssertSagaInstanceViewModelExsistsService,
        },
      ],
    }).compile();

    handler = module.get<FindSagaInstanceViewModelByIdQueryHandler>(
      FindSagaInstanceViewModelByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return saga instance view model when saga instance exists', async () => {
      const sagaInstanceId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto = { id: sagaInstanceId };
      const query = new FindSagaInstanceViewModelByIdQuery(queryDto);

      const mockViewModel = new SagaInstanceViewModel({
        id: sagaInstanceId,
        name: 'Order Processing Saga',
        status: 'PENDING',
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockAssertSagaInstanceViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(sagaInstanceId);
      expect(
        mockAssertSagaInstanceViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(sagaInstanceId);
    });
  });
});
