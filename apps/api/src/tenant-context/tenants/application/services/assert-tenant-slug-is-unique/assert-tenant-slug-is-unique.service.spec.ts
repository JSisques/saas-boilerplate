import { TenantSlugIsNotUniqueException } from '@/tenant-context/tenants/application/exceptions/tenant-slug-is-not-unique/tenant-slug-is-not-unique.exception';
import { AssertTenantSlugIsUniqueService } from '@/tenant-context/tenants/application/services/assert-tenant-slug-is-unique/assert-tenant-slug-is-unique.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantWriteRepository } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';

describe('AssertTenantSlugIsUniqueService', () => {
  let service: AssertTenantSlugIsUniqueService;
  let mockTenantWriteRepository: jest.Mocked<TenantWriteRepository>;

  beforeEach(() => {
    mockTenantWriteRepository = {
      findById: jest.fn(),
      findBySlug: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantWriteRepository>;

    service = new AssertTenantSlugIsUniqueService(mockTenantWriteRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should not throw when slug is unique', async () => {
      const slug = 'unique-slug';

      mockTenantWriteRepository.findBySlug.mockResolvedValue(null);

      await expect(service.execute(slug)).resolves.toBeUndefined();
      expect(mockTenantWriteRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(mockTenantWriteRepository.findBySlug).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantSlugIsNotUniqueException when slug is not unique', async () => {
      const slug = 'existing-slug';
      const now = new Date();

      const existingTenant = new TenantAggregate(
        {
          id: new TenantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          name: new TenantNameValueObject('Existing Tenant'),
          slug: new TenantSlugValueObject(slug),
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

      mockTenantWriteRepository.findBySlug.mockResolvedValue(existingTenant);

      await expect(service.execute(slug)).rejects.toThrow(
        TenantSlugIsNotUniqueException,
      );
      expect(mockTenantWriteRepository.findBySlug).toHaveBeenCalledWith(slug);
    });
  });
});
