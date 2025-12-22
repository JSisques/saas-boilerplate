import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { FindTenantsByCriteriaQuery } from '@/tenant-context/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query';
import { FindTenantsByCriteriaQueryHandler } from '@/tenant-context/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query-handler';
import { ITenantFindByCriteriaQueryDto } from '@/tenant-context/tenants/application/dtos/find-tenants-by-criteria/find-tenants-by-criteria-query.dto';
import { TenantStatusEnum } from '@/tenant-context/tenants/domain/enums/tenant-status/tenant-status.enum';
import { TenantReadRepository } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TenantViewModel } from '@/tenant-context/tenants/domain/view-models/tenant/tenant.view-model';

describe('FindTenantsByCriteriaQueryHandler', () => {
  let handler: FindTenantsByCriteriaQueryHandler;
  let mockTenantReadRepository: jest.Mocked<TenantReadRepository>;

  beforeEach(() => {
    mockTenantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantReadRepository>;

    handler = new FindTenantsByCriteriaQueryHandler(mockTenantReadRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result with tenants when criteria matches', async () => {
      const criteria = new Criteria();
      const queryDto: ITenantFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindTenantsByCriteriaQuery(queryDto);

      const mockTenants: TenantViewModel[] = [
        new TenantViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Tenant 1',
          slug: 'test-tenant-1',
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
        }),
        new TenantViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Test Tenant 2',
          slug: 'test-tenant-2',
          description: null,
          websiteUrl: null,
          logoUrl: null,
          faviconUrl: null,
          primaryColor: null,
          secondaryColor: null,
          status: TenantStatusEnum.INACTIVE,
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
          createdAt: new Date('2024-01-02T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
        }),
      ];

      const mockPaginatedResult = new PaginatedResult(mockTenants, 2, 1, 10);

      mockTenantReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(mockTenantReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockTenantReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no tenants match criteria', async () => {
      const criteria = new Criteria();
      const queryDto: ITenantFindByCriteriaQueryDto = {
        criteria,
      };
      const query = new FindTenantsByCriteriaQuery(queryDto);

      const mockPaginatedResult = new PaginatedResult([], 0, 1, 10);

      mockTenantReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockTenantReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });
  });
});
