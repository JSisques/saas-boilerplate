import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model/tenant-member-view-model.factory';
import { TenantMemberViewModel } from '@/tenant-context/tenant-members/domain/view-models/tenant-member/tenant-member.view-model';
import { TenantMemberMongoDbDto } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/dtos/tenant-member-mongodb.dto';
import { TenantMemberMongoDBMapper } from './tenant-member-mongodb.mapper';

describe('TenantMemberMongoDBMapper', () => {
  let mapper: TenantMemberMongoDBMapper;
  let mockTenantMemberViewModelFactory: jest.Mocked<TenantMemberViewModelFactory>;

  beforeEach(() => {
    mockTenantMemberViewModelFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
      fromAggregate: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberViewModelFactory>;

    mapper = new TenantMemberMongoDBMapper(mockTenantMemberViewModelFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toViewModel', () => {
    it('should convert MongoDB document to view model with all properties', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mongoData: TenantMemberMongoDbDto = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: mongoData.tenantId,
        userId: mongoData.userId,
        role: mongoData.role,
        createdAt: now,
        updatedAt: now,
      });

      mockTenantMemberViewModelFactory.create.mockReturnValue(mockViewModel);

      const result = mapper.toViewModel(mongoData);

      expect(result).toBe(mockViewModel);
      expect(mockTenantMemberViewModelFactory.create).toHaveBeenCalledWith({
        id: tenantMemberId,
        tenantId: mongoData.tenantId,
        userId: mongoData.userId,
        role: mongoData.role,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      });
      expect(mockTenantMemberViewModelFactory.create).toHaveBeenCalledTimes(1);
    });

    it('should convert MongoDB document with different roles', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const mongoData: TenantMemberMongoDbDto = {
          id: tenantMemberId,
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt: now,
          updatedAt: now,
        };

        const mockViewModel = new TenantMemberViewModel({
          id: tenantMemberId,
          tenantId: mongoData.tenantId,
          userId: mongoData.userId,
          role,
          createdAt: now,
          updatedAt: now,
        });

        mockTenantMemberViewModelFactory.create.mockReturnValue(mockViewModel);

        const result = mapper.toViewModel(mongoData);

        expect(result.role).toBe(role);
        expect(mockTenantMemberViewModelFactory.create).toHaveBeenCalledWith({
          id: tenantMemberId,
          tenantId: mongoData.tenantId,
          userId: mongoData.userId,
          role,
          createdAt: new Date(now),
          updatedAt: new Date(now),
        });

        jest.clearAllMocks();
      });
    });

    it('should convert Date objects correctly', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-02T10:00:00Z');

      const mongoData: TenantMemberMongoDbDto = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt,
        updatedAt,
      };

      const mockViewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: mongoData.tenantId,
        userId: mongoData.userId,
        role: mongoData.role,
        createdAt,
        updatedAt,
      });

      mockTenantMemberViewModelFactory.create.mockReturnValue(mockViewModel);

      mapper.toViewModel(mongoData);

      expect(mockTenantMemberViewModelFactory.create).toHaveBeenCalledWith({
        id: tenantMemberId,
        tenantId: mongoData.tenantId,
        userId: mongoData.userId,
        role: mongoData.role,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('toMongoData', () => {
    it('should convert view model to MongoDB document with all properties', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const viewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result).toEqual({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert view model with different roles', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
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
          createdAt: now,
          updatedAt: now,
        });

        const result = mapper.toMongoData(viewModel);

        expect(result.role).toBe(role);
      });
    });

    it('should extract all properties from view model', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const viewModel = new TenantMemberViewModel({
        id: tenantMemberId,
        tenantId,
        userId,
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toMongoData(viewModel);

      expect(result.id).toBe(tenantMemberId);
      expect(result.tenantId).toBe(tenantId);
      expect(result.userId).toBe(userId);
      expect(result.role).toBe(TenantMemberRoleEnum.ADMIN);
      expect(result.createdAt).toBe(now);
      expect(result.updatedAt).toBe(now);
    });
  });
});
