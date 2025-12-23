import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantCreatedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-created/tenant-created.event-handler';
import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model/tenant-view-model.factory';
import { TenantReadRepository } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantPrimitives } from '@/tenant-context/tenants/domain/primitives/tenant.primitives';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';

describe('TenantCreatedEventHandler', () => {
  let handler: TenantCreatedEventHandler;
  let mockTenantReadRepository: jest.Mocked<TenantReadRepository>;
  let mockTenantViewModelFactory: jest.Mocked<TenantViewModelFactory>;

  beforeEach(() => {
    mockTenantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantReadRepository>;

    mockTenantViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<TenantViewModelFactory>;

    handler = new TenantCreatedEventHandler(
      mockTenantReadRepository,
      mockTenantViewModelFactory,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create and save tenant view model when event is received', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantPrimitives: TenantPrimitives = {
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
      };

      const event = new TenantCreatedEvent(
        {
          aggregateId: tenantId,
          aggregateType: 'TenantAggregate',
          eventType: 'TenantCreatedEvent',
        },
        tenantPrimitives,
      );
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

      mockTenantViewModelFactory.fromPrimitives.mockReturnValue(mockViewModel);
      mockTenantReadRepository.save.mockResolvedValue(undefined);

      await handler.handle(event);

      expect(mockTenantViewModelFactory.fromPrimitives).toHaveBeenCalledWith(
        tenantPrimitives,
      );
      expect(mockTenantReadRepository.save).toHaveBeenCalledWith(mockViewModel);
    });
  });
});
