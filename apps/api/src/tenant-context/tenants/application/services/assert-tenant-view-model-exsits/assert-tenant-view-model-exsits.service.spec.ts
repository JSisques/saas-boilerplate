import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantReadRepository } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';

describe('AssertTenantViewModelExsistsService', () => {
  let service: AssertTenantViewModelExsistsService;
  let mockTenantReadRepository: jest.Mocked<TenantReadRepository>;

  beforeEach(() => {
    mockTenantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantReadRepository>;

    service = new AssertTenantViewModelExsistsService(mockTenantReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant view model when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      const mockViewModel = new TenantViewModel({
        id: tenantId,
        name: 'Test Tenant',
        slug: 'test-tenant',
        description: null,
        websiteUrl: null,
        logoUrl: null,
        faviconUrl: null,
        primaryColor: null,
        secondaryColor: null,
        status: TenantStatusEnum.ACTIVE,
        email: null,
        phoneNumber: null,
        phoneCode: null,
        address: null,
        city: null,
        state: null,
        country: null,
        postalCode: null,
        timezone: null,
        locale: null,
        maxUsers: null,
        maxStorage: null,
        maxApiCalls: null,
        tenantMembers: [],
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });

      mockTenantReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(tenantId);

      expect(result).toBe(mockViewModel);
      expect(mockTenantReadRepository.findById).toHaveBeenCalledWith(tenantId);
      expect(mockTenantReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantNotFoundException when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockTenantReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(tenantId)).rejects.toThrow(
        TenantNotFoundException,
      );
      expect(mockTenantReadRepository.findById).toHaveBeenCalledWith(tenantId);
    });
  });
});
