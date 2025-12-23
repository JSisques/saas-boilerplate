import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberWriteRepository } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { AssertTenantMemberExsistsService } from './assert-tenant-member-exsits.service';

describe('AssertTenantMemberExsistsService', () => {
  let service: AssertTenantMemberExsistsService;
  let mockTenantMemberWriteRepository: jest.Mocked<TenantMemberWriteRepository>;

  beforeEach(() => {
    mockTenantMemberWriteRepository = {
      findById: jest.fn(),
      findByTenantIdAndUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberWriteRepository>;

    service = new AssertTenantMemberExsistsService(
      mockTenantMemberWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant member aggregate when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantMemberWriteRepository.findById.mockResolvedValue(
        mockTenantMember,
      );

      const result = await service.execute(tenantMemberId);

      expect(result).toBe(mockTenantMember);
      expect(mockTenantMemberWriteRepository.findById).toHaveBeenCalledWith(
        tenantMemberId,
      );
      expect(mockTenantMemberWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantMemberNotFoundException when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockTenantMemberWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(tenantMemberId)).rejects.toThrow(
        TenantMemberNotFoundException,
      );
      await expect(service.execute(tenantMemberId)).rejects.toThrow(
        `Tenant member with id ${tenantMemberId} not found`,
      );

      expect(mockTenantMemberWriteRepository.findById).toHaveBeenCalledWith(
        tenantMemberId,
      );
    });

    it('should call repository with correct id', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantMemberWriteRepository.findById.mockResolvedValue(
        mockTenantMember,
      );

      await service.execute(tenantMemberId);

      expect(mockTenantMemberWriteRepository.findById).toHaveBeenCalledWith(
        tenantMemberId,
      );
      expect(mockTenantMemberWriteRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
