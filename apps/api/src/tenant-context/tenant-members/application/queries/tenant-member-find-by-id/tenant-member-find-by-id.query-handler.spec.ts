import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberFindByIdQueryDto } from '@/tenant-context/tenant-members/application/dtos/queries/tenant-member-find-by-id/tenant-member-find-by-id.dto';
import { TenantMemberNotFoundException } from '@/tenant-context/tenant-members/application/exceptions/tenant-member-not-found/tenant-member-not-found.exception';
import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberCreatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-created-at/tenant-member-created-at.vo';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberUpdatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-updated-at/tenant-member-updated-at.vo';
import { FindTenantMemberByIdQuery } from './tenant-member-find-by-id.query';
import { FindTenantMemberByIdQueryHandler } from './tenant-member-find-by-id.query-handler';

describe('FindTenantMemberByIdQueryHandler', () => {
  let handler: FindTenantMemberByIdQueryHandler;
  let mockAssertTenantMemberExsistsService: jest.Mocked<AssertTenantMemberExsistsService>;

  beforeEach(() => {
    mockAssertTenantMemberExsistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertTenantMemberExsistsService>;

    handler = new FindTenantMemberByIdQueryHandler(
      mockAssertTenantMemberExsistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return tenant member aggregate when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantMemberFindByIdQueryDto = { id: tenantMemberId };
      const query = new FindTenantMemberByIdQuery(queryDto);

      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject('323e4567-e89b-12d3-a456-426614174000'),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new TenantMemberCreatedAtValueObject(now),
          updatedAt: new TenantMemberUpdatedAtValueObject(now),
        },
        false,
      );

      mockAssertTenantMemberExsistsService.execute.mockResolvedValue(
        mockTenantMember,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockTenantMember);
      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        tenantMemberId,
      );
      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw exception when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantMemberFindByIdQueryDto = { id: tenantMemberId };
      const query = new FindTenantMemberByIdQuery(queryDto);

      const error = new TenantMemberNotFoundException(tenantMemberId);
      mockAssertTenantMemberExsistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      await expect(handler.execute(query)).rejects.toThrow(
        `Tenant member with id ${tenantMemberId} not found`,
      );

      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        tenantMemberId,
      );
    });

    it('should call service with correct id from query', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const queryDto: ITenantMemberFindByIdQueryDto = { id: tenantMemberId };
      const query = new FindTenantMemberByIdQuery(queryDto);

      const now = new Date();
      const mockTenantMember = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject('323e4567-e89b-12d3-a456-426614174000'),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new TenantMemberCreatedAtValueObject(now),
          updatedAt: new TenantMemberUpdatedAtValueObject(now),
        },
        false,
      );

      mockAssertTenantMemberExsistsService.execute.mockResolvedValue(
        mockTenantMember,
      );

      await handler.execute(query);

      expect(mockAssertTenantMemberExsistsService.execute).toHaveBeenCalledWith(
        query.id.value,
      );
      expect(query.id).toBeInstanceOf(TenantMemberUuidValueObject);
      expect(query.id.value).toBe(tenantMemberId);
    });
  });
});

