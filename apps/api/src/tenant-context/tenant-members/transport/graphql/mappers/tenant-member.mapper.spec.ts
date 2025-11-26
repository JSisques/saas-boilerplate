import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberGraphQLMapper } from './tenant-member.mapper';

describe('TenantMemberGraphQLMapper', () => {
  let mapper: TenantMemberGraphQLMapper;

  beforeEach(() => {
    mapper = new TenantMemberGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert tenant member view model to response DTO with all properties', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt,
        updatedAt,
      });
    });

    it('should convert tenant member view model with different roles', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const viewModel = new TenantMemberViewModel({
          id: tenantMemberId,
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt,
          updatedAt,
        });

        const result = mapper.toResponseDto(viewModel);

        expect(result.role).toBe(role);
        expect(result.id).toBe(tenantMemberId);
        expect(result.tenantId).toBe('223e4567-e89b-12d3-a456-426614174000');
        expect(result.userId).toBe('323e4567-e89b-12d3-a456-426614174000');
        expect(result.createdAt).toEqual(createdAt);
        expect(result.updatedAt).toEqual(updatedAt);
      });
    });

    it('should extract all properties from view model', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId,
        userId,
        role: TenantMemberRoleEnum.ADMIN,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result.id).toBe(tenantMemberId);
      expect(result.tenantId).toBe(tenantId);
      expect(result.userId).toBe(userId);
      expect(result.role).toBe(TenantMemberRoleEnum.ADMIN);
      expect(result.createdAt).toBe(createdAt);
      expect(result.updatedAt).toBe(updatedAt);
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        }),
        new TenantMemberViewModel({
          id: '423e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '523e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        2,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.items[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.items[1].id).toBe('423e4567-e89b-12d3-a456-426614174000');
    });

    it('should convert empty paginated result to empty paginated response DTO', () => {
      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        [],
        0,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(0);
    });

    it('should convert paginated result with multiple pages', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        25,
        2,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(25);
      expect(result.page).toBe(2);
      expect(result.perPage).toBe(10);
      expect(result.totalPages).toBe(3);
    });

    it('should map all items in paginated result', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: TenantMemberViewModel[] = [
        new TenantMemberViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.MEMBER,
          createdAt,
          updatedAt,
        }),
        new TenantMemberViewModel({
          id: '423e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '523e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.ADMIN,
          createdAt,
          updatedAt,
        }),
        new TenantMemberViewModel({
          id: '623e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '723e4567-e89b-12d3-a456-426614174000',
          role: TenantMemberRoleEnum.OWNER,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult<TenantMemberViewModel>(
        viewModels,
        3,
        1,
        10,
      );

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result.items).toHaveLength(3);
      result.items.forEach((item, index) => {
        expect(item.id).toBe(viewModels[index].id);
        expect(item.tenantId).toBe(viewModels[index].tenantId);
        expect(item.userId).toBe(viewModels[index].userId);
        expect(item.role).toBe(viewModels[index].role);
      });
    });
  });
});
