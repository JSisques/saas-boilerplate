import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { ITenantMemberFindViewModelByIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-view-model-by-id/tenant-member-find-view-model-by-id.dto';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { FindTenantMemberViewModelByIdQuery } from './tenant-member-find-view-model-by-id.query';
import { FindTenantMemberViewModelByIdQueryHandler } from './tenant-member-find-view-model-by-id.query-handler';

describe('FindTenantMemberViewModelByIdQueryHandler', () => {
  let handler: FindTenantMemberViewModelByIdQueryHandler;
  let mockAssertTenantMemberViewModelExsistsService: jest.Mocked<AssertTenantMemberViewModelExsistsService>;

  beforeEach(() => {
    mockAssertTenantMemberViewModelExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantMemberViewModelExsistsService>;

    handler = new FindTenantMemberViewModelByIdQueryHandler(
      mockAssertTenantMemberViewModelExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant member view model when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantMemberFindViewModelByIdQueryDto = {
        id: tenantMemberId,
      };
      const query = new FindTenantMemberViewModelByIdQuery(queryDto);

      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertTenantMemberViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertTenantMemberViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantMemberId);
      expect(
        mockAssertTenantMemberViewModelExsistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw exception when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantMemberFindViewModelByIdQueryDto = {
        id: tenantMemberId,
      };
      const query = new FindTenantMemberViewModelByIdQuery(queryDto);

      const error = new TenantMemberNotFoundException(tenantMemberId);
      mockAssertTenantMemberViewModelExsistsService.execute.mockRejectedValue(
        error,
      );

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `Tenant member with id ${tenantMemberId} not found`,
      );

      expect(
        mockAssertTenantMemberViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(tenantMemberId);
    });

    it('should call service with correct id from query', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantMemberFindViewModelByIdQueryDto = {
        id: tenantMemberId,
      };
      const query = new FindTenantMemberViewModelByIdQuery(queryDto);

      const now = new Date();
      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      mockAssertTenantMemberViewModelExsistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      await handler.execute(query);

      expect(
        mockAssertTenantMemberViewModelExsistsService.execute,
      ).toHaveBeenCalledWith(query.id.value);
      expect(query.id).toBeInstanceOf(TenantMemberUuidValueObject);
      expect(query.id.value).toBe(tenantMemberId);
    });
  });
});

