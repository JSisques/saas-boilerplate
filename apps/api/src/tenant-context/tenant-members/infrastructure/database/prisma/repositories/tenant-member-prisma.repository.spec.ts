import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberPrismaDto } from '@/tenant-context/tenant-members/infrastructure/database/prisma/dtos/tenant-member-prisma.dto';
import { TenantMemberPrismaMapper } from '@/tenant-context/tenant-members/infrastructure/database/prisma/mappers/tenant-member-prisma.mapper';
import { TenantMemberCreatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-created-at/tenant-member-created-at.vo';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberUpdatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-updated-at/tenant-member-updated-at.vo';
import { TenantMemberRoleEnum as PrismaTenantMemberRoleEnum } from '@prisma/client';
import { TenantMemberPrismaRepository } from './tenant-member-prisma.repository';

describe('TenantMemberPrismaRepository', () => {
  let repository: TenantMemberPrismaRepository;
  let mockPrismaService: any;
  let mockTenantMemberPrismaMapper: jest.Mocked<TenantMemberPrismaMapper>;
  let mockFindUnique: jest.Mock;
  let mockFindMany: jest.Mock;
  let mockFindFirst: jest.Mock;
  let mockUpsert: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockFindUnique = jest.fn();
    mockFindMany = jest.fn();
    mockFindFirst = jest.fn();
    mockUpsert = jest.fn();
    mockDelete = jest.fn();

    mockPrismaService = {
      tenantMember: {
        findUnique: mockFindUnique,
        findMany: mockFindMany,
        findFirst: mockFindFirst,
        upsert: mockUpsert,
        delete: mockDelete,
      },
    };

    mockTenantMemberPrismaMapper = {
      toDomainEntity: jest.fn(),
      toPrismaData: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberPrismaMapper>;

    repository = new TenantMemberPrismaRepository(
      mockPrismaService,
      mockTenantMemberPrismaMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return tenant member aggregate when tenant member exists', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: TenantMemberPrismaDto = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: PrismaTenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const tenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(prismaData.tenantId),
          userId: new UserUuidValueObject(prismaData.userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new TenantMemberCreatedAtValueObject(now),
          updatedAt: new TenantMemberUpdatedAtValueObject(now),
        },
        false,
      );

      mockFindUnique.mockResolvedValue(prismaData);
      mockTenantMemberPrismaMapper.toDomainEntity.mockReturnValue(
        tenantMemberAggregate,
      );

      const result = await repository.findById(tenantMemberId);

      expect(result).toBe(tenantMemberAggregate);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: tenantMemberId },
      });
      expect(mockTenantMemberPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
      expect(
        mockTenantMemberPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return null when tenant member does not exist', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findById(tenantMemberId);

      expect(result).toBeNull();
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: tenantMemberId },
      });
      expect(mockTenantMemberPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('findByTenantId', () => {
    it('should return array of tenant member aggregates when tenant members exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaDataArray: TenantMemberPrismaDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId,
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role: PrismaTenantMemberRoleEnum.MEMBER,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: '423e4567-e89b-12d3-a456-426614174000',
          tenantId,
          userId: '523e4567-e89b-12d3-a456-426614174000',
          role: PrismaTenantMemberRoleEnum.ADMIN,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const tenantMemberAggregates = prismaDataArray.map(
        (data) =>
          new TenantMemberAggregate(
            {
              id: new TenantMemberUuidValueObject(data.id),
              tenantId: new TenantUuidValueObject(data.tenantId),
              userId: new UserUuidValueObject(data.userId),
              role: new TenantMemberRoleValueObject(
                data.role as TenantMemberRoleEnum,
              ),
              createdAt: new TenantMemberCreatedAtValueObject(now),
              updatedAt: new TenantMemberUpdatedAtValueObject(now),
            },
            false,
          ),
      );

      mockFindMany.mockResolvedValue(prismaDataArray);
      prismaDataArray.forEach((data, index) => {
        mockTenantMemberPrismaMapper.toDomainEntity.mockReturnValueOnce(
          tenantMemberAggregates[index],
        );
      });

      const result = await repository.findByTenantId(tenantId);

      expect(result).toHaveLength(2);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { tenantId },
      });
      expect(
        mockTenantMemberPrismaMapper.toDomainEntity,
      ).toHaveBeenCalledTimes(2);
    });

    it('should return empty array when no tenant members exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';

      mockFindMany.mockResolvedValue([]);

      const result = await repository.findByTenantId(tenantId);

      expect(result).toEqual([]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { tenantId },
      });
    });
  });

  describe('findByUserId', () => {
    it('should return array of tenant member aggregates when tenant members exist', async () => {
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaDataArray: TenantMemberPrismaDto[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId,
          role: PrismaTenantMemberRoleEnum.MEMBER,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const tenantMemberAggregates = prismaDataArray.map(
        (data) =>
          new TenantMemberAggregate(
            {
              id: new TenantMemberUuidValueObject(data.id),
              tenantId: new TenantUuidValueObject(data.tenantId),
              userId: new UserUuidValueObject(data.userId),
              role: new TenantMemberRoleValueObject(
                data.role as TenantMemberRoleEnum,
              ),
              createdAt: new TenantMemberCreatedAtValueObject(now),
              updatedAt: new TenantMemberUpdatedAtValueObject(now),
            },
            false,
          ),
      );

      mockFindMany.mockResolvedValue(prismaDataArray);
      mockTenantMemberPrismaMapper.toDomainEntity.mockReturnValue(
        tenantMemberAggregates[0],
      );

      const result = await repository.findByUserId(userId);

      expect(result).toHaveLength(1);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('findByTenantIdAndUserId', () => {
    it('should return tenant member aggregate when tenant member exists', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const prismaData: TenantMemberPrismaDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId,
        userId,
        role: PrismaTenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const tenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(prismaData.id),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new TenantMemberCreatedAtValueObject(now),
          updatedAt: new TenantMemberUpdatedAtValueObject(now),
        },
        false,
      );

      mockFindFirst.mockResolvedValue(prismaData);
      mockTenantMemberPrismaMapper.toDomainEntity.mockReturnValue(
        tenantMemberAggregate,
      );

      const result = await repository.findByTenantIdAndUserId(tenantId, userId);

      expect(result).toBe(tenantMemberAggregate);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { tenantId, userId },
      });
      expect(mockTenantMemberPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        prismaData,
      );
    });

    it('should return null when tenant member does not exist', async () => {
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';

      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByTenantIdAndUserId(tenantId, userId);

      expect(result).toBeNull();
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { tenantId, userId },
      });
      expect(mockTenantMemberPrismaMapper.toDomainEntity).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save tenant member aggregate and return saved aggregate', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const tenantMemberAggregate = new TenantMemberAggregate(
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

      const prismaData: TenantMemberPrismaDto = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: PrismaTenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const savedPrismaData: TenantMemberPrismaDto = {
        ...prismaData,
      };

      const savedTenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(prismaData.tenantId),
          userId: new UserUuidValueObject(prismaData.userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new TenantMemberCreatedAtValueObject(now),
          updatedAt: new TenantMemberUpdatedAtValueObject(now),
        },
        false,
      );

      mockTenantMemberPrismaMapper.toPrismaData.mockReturnValue(prismaData);
      mockUpsert.mockResolvedValue(savedPrismaData);
      mockTenantMemberPrismaMapper.toDomainEntity.mockReturnValue(
        savedTenantMemberAggregate,
      );

      const result = await repository.save(tenantMemberAggregate);

      expect(result).toBe(savedTenantMemberAggregate);
      expect(mockTenantMemberPrismaMapper.toPrismaData).toHaveBeenCalledWith(
        tenantMemberAggregate,
      );
      expect(mockUpsert).toHaveBeenCalledWith({
        where: { id: tenantMemberId },
        update: prismaData,
        create: prismaData,
      });
      expect(mockTenantMemberPrismaMapper.toDomainEntity).toHaveBeenCalledWith(
        savedPrismaData,
      );
    });
  });

  describe('delete', () => {
    it('should delete tenant member and return true', async () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';

      mockDelete.mockResolvedValue(undefined);

      const result = await repository.delete(tenantMemberId);

      expect(result).toBe(true);
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: tenantMemberId },
      });
    });
  });
});

