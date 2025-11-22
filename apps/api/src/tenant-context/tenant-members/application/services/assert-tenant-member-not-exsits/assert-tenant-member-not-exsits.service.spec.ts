import { TenantMemberAlreadyExistsException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-already-exists/tenant-member-already-exists.exception';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import {
  TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
  TenantMemberWriteRepository,
} from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { AssertTenantMemberNotExsistsService } from './assert-tenant-member-not-exsits.service';

describe('AssertTenantMemberNotExsistsService', () => {
  let service: AssertTenantMemberNotExsistsService;
  let mockTenantMemberWriteRepository: jest.Mocked<TenantMemberWriteRepository>;

  beforeEach(() => {
    mockTenantMemberWriteRepository = {
      findById: jest.fn(),
      findByTenantIdAndUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberWriteRepository>;

    service = new AssertTenantMemberNotExsistsService(
      mockTenantMemberWriteRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should not throw when tenant member does not exist', async () => {
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
      };

      mockTenantMemberWriteRepository.findByTenantIdAndUserId.mockResolvedValue(
        null,
      );

      await expect(service.execute(input)).resolves.toBeUndefined();
      expect(
        mockTenantMemberWriteRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledWith(input.tenantId, input.userId);
      expect(
        mockTenantMemberWriteRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw TenantMemberAlreadyExistsException when tenant member exists', async () => {
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
      };

      const existingTenantMember = {} as TenantMemberAggregate;
      mockTenantMemberWriteRepository.findByTenantIdAndUserId.mockResolvedValue(
        existingTenantMember,
      );

      await expect(service.execute(input)).rejects.toThrow(
        TenantMemberAlreadyExistsException,
      );
      await expect(service.execute(input)).rejects.toThrow(
        `Tenant member with tenant id ${input.tenantId} and user id ${input.userId} already exists`,
      );

      expect(
        mockTenantMemberWriteRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledWith(input.tenantId, input.userId);
    });

    it('should call repository with correct tenantId and userId', async () => {
      const input = {
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
      };

      mockTenantMemberWriteRepository.findByTenantIdAndUserId.mockResolvedValue(
        null,
      );

      await service.execute(input);

      expect(
        mockTenantMemberWriteRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledWith(input.tenantId, input.userId);
      expect(
        mockTenantMemberWriteRepository.findByTenantIdAndUserId,
      ).toHaveBeenCalledTimes(1);
    });
  });
});

