import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { TenantMemberReadRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { AssertTenantMemberViewModelExsistsService } from './assert-tenant-member-view-model-exsits.service';

describe('AssertTenantMemberViewModelExsistsService', () => {
  let service: AssertTenantMemberViewModelExsistsService;
  let mockTenantMemberReadRepository: jest.Mocked<TenantMemberReadRepository>;

  beforeEach(() => {
    mockTenantMemberReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberReadRepository>;

    service = new AssertTenantMemberViewModelExsistsService(
      mockTenantMemberReadRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant member view model when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      mockTenantMemberReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(tenantMemberId);

      expect(result).toBe(mockViewModel);
      expect(mockTenantMemberReadRepository.findById).toHaveBeenCalledWith(
        tenantMemberId,
      );
      expect(mockTenantMemberReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantMemberNotFoundException when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockTenantMemberReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(tenantMemberId)).rejects.toThrow(
        TenantMemberNotFoundException,
      );
      await expect(service.execute(tenantMemberId)).rejects.toThrow(
        `Tenant member with id ${tenantMemberId} not found`,
      );

      expect(mockTenantMemberReadRepository.findById).toHaveBeenCalledWith(
        tenantMemberId,
      );
    });

    it('should call repository with correct id', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      mockTenantMemberReadRepository.findById.mockResolvedValue(mockViewModel);

      await service.execute(tenantMemberId);

      expect(mockTenantMemberReadRepository.findById).toHaveBeenCalledWith(
        tenantMemberId,
      );
      expect(mockTenantMemberReadRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
