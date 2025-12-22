import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { TenantDeletedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-deleted/tenant-deleted.event-handler';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantReadRepository } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';

describe('TenantDeletedEventHandler', () => {
  let handler: TenantDeletedEventHandler;
  let mockTenantReadRepository: jest.Mocked<TenantReadRepository>;
  let mockAssertTenantViewModelExsistsService: jest.Mocked<AssertTenantViewModelExsistsService>;

  beforeEach(() => {
    mockTenantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantReadRepository>;

    mockAssertTenantViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantViewModelExsistsService>;

    handler = new TenantDeletedEventHandler(
      mockTenantReadRepository,
      mockAssertTenantViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete tenant view model when event is handled', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      const event = new TenantDeletedEvent(
        {
          aggregateId: tenantId,
          aggregateType: 'TenantAggregate',
          eventType: 'TenantDeletedEvent',
        },
        {
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
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      );

      const existingViewModel = new TenantViewModel({
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

      mockAssertTenantViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockTenantReadRepository.delete.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertTenantViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantId);
      expect(mockTenantReadRepository.delete).toHaveBeenCalledWith(tenantId);
      expect(mockTenantReadRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
