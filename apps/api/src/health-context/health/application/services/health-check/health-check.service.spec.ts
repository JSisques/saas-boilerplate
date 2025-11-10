import { HealthStatusEnum } from '@/health-context/health/domain/enum/health-status.enum';
import { HealthViewModelFactory } from '@/health-context/health/domain/factories/health-view-model.factory';
import { HealthViewModel } from '@/health-context/health/domain/view-models/health.view-model';
import { HealthCheckService } from '@/health-context/health/application/services/health-check/health-check.service';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let mockHealthViewModelFactory: jest.Mocked<HealthViewModelFactory>;

  beforeEach(() => {
    mockHealthViewModelFactory = {
      create: jest.fn(),
      fromAggregate: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<HealthViewModelFactory>;

    service = new HealthCheckService(mockHealthViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create health view model with OK status', async () => {
    const expectedViewModel = new HealthViewModel({
      status: HealthStatusEnum.OK,
    });
    mockHealthViewModelFactory.create.mockReturnValue(expectedViewModel);

    const result = await service.execute();

    expect(mockHealthViewModelFactory.create).toHaveBeenCalledWith({
      status: HealthStatusEnum.OK,
    });
    expect(result).toBe(expectedViewModel);
  });
});
