import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantWriteRepository } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';

describe('AssertTenantExsistsService', () => {
  let service: AssertTenantExsistsService;
  let mockTenantWriteRepository: jest.Mocked<TenantWriteRepository>;

  beforeEach(() => {
    mockTenantWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantWriteRepository>;

    service = new AssertTenantExsistsService(mockTenantWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant aggregate when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockTenant = new TenantAggregate(
        {
          id: new TenantUuidValueObject(tenantId),
          name: new TenantNameValueObject('Test Tenant'),
          slug: new TenantSlugValueObject('test-tenant'),
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: new TenantStatusValueObject(TenantStatusEnum.ACTIVE),
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
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantWriteRepository.findById.mockResolvedValue(mockTenant);

      const result = await service.execute(tenantId);

      expect(result).toBe(mockTenant);
      expect(mockTenantWriteRepository.findById).toHaveBeenCalledWith(tenantId);
      expect(mockTenantWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantNotFoundException when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      mockTenantWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(tenantId)).rejects.toThrow(
        TenantNotFoundException,
      );
      expect(mockTenantWriteRepository.findById).toHaveBeenCalledWith(tenantId);
    });
  });
});
