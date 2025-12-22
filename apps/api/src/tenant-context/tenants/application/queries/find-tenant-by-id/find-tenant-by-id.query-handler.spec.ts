import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { FindTenantByIdQuery } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query';
import { FindTenantByIdQueryHandler } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query-handler';
import { TenantNotFoundException } from '@/tenant-context/tenants/application/exceptions/tenant-not-found/tenant-not-found.exception';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { TenantAggregate } from '@/tenant-context/tenants/domain/aggregates/tenant.aggregate';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantNameValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-name/tenant-name.vo';
import { TenantSlugValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-slug/tenant-slug.vo';
import { TenantStatusValueObject } from '@/tenant-context/tenants/domain/value-objects/tenant-status/tenant-status.vo';

describe('FindTenantByIdQueryHandler', () => {
  let handler: FindTenantByIdQueryHandler;
  let mockAssertTenantExsistsService: jest.Mocked<AssertTenantExsistsService>;

  beforeEach(() => {
    mockAssertTenantExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantExsistsService>;

    handler = new FindTenantByIdQueryHandler(mockAssertTenantExsistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant aggregate when tenant exists', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const query = new FindTenantByIdQuery({ id: tenantId });
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

      mockAssertTenantExsistsService.execute.mockResolvedValue(mockTenant);

      const result = await handler.execute(query);

      expect(result).toBe(mockTenant);
      expect(mockAssertTenantExsistsService.execute).toHaveBeenCalledWith(
        tenantId,
      );
      expect(mockAssertTenantExsistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantNotFoundException when tenant does not exist', async () => {
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';

      const query = new FindTenantByIdQuery({ id: tenantId });
      const error = new TenantNotFoundException(tenantId);

      mockAssertTenantExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(
        TenantNotFoundException,
      );
      expect(mockAssertTenantExsistsService.execute).toHaveBeenCalledWith(
        tenantId,
      );
    });
  });
});
