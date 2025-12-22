import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';
import { TenantUpdatedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-updated/tenant-updated.event-handler';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantReadRepository } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';
import { ITenantUpdateViewModelDto } from '@/tenant-context/tenants/domain/dtos/view-models/tenant-update/tenant-update-view-model.dto';

describe('TenantUpdatedEventHandler', () => {
  let handler: TenantUpdatedEventHandler;
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

    handler = new TenantUpdatedEventHandler(
      mockTenantReadRepository,
      mockAssertTenantViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update and save tenant view model when event is handled', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData: ITenantUpdateViewModelDto = {
        name: 'Updated Tenant',
        status: TenantStatusEnum.INACTIVE,
      };

      const event = new TenantUpdatedEvent(
        {
          aggregateId: tenantId,
          aggregateType: 'TenantAggregate',
          eventType: 'TenantUpdatedEvent',
        },
        updateData,
      );

      const existingViewModel = new TenantViewModel({
        id: tenantId,
        name: 'Original Tenant',
        slug: 'original-tenant',
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

      const updateSpy = jest.spyOn(existingViewModel, 'update');
      mockAssertTenantViewModelExsistsService.execute.mockResolvedValue(
        existingViewModel,
      );
      mockTenantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(
        mockAssertTenantViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantId);
      expect(updateSpy).toHaveBeenCalledWith(updateData);
      expect(mockTenantReadRepository.save).toHaveBeenCalledWith(
        existingViewModel,
      );
      expect(mockTenantReadRepository.save).toHaveBeenCalledTimes(1);

      updateSpy.mockRestore();
    });
  });
});
