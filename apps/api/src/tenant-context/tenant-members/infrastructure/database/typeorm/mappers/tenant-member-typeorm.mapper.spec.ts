import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberTypeormEntity } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/entities/tenant-member-typeorm.entity';
import { TenantMemberTypeormMapper } from '@/tenant-context/tenant-members/infrastructure/database/typeorm/mappers/tenant-member-typeorm.mapper';

describe('TenantMemberTypeormMapper', () => {
  let mapper: TenantMemberTypeormMapper;
  let mockTenantMemberAggregateFactory: jest.Mocked<TenantMemberAggregateFactory>;

  beforeEach(() => {
    mockTenantMemberAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberAggregateFactory>;

    mapper = new TenantMemberTypeormMapper(mockTenantMemberAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert TypeORM entity to domain entity with all properties', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const typeormEntity = new TenantMemberTypeormEntity();
      typeormEntity.id = tenantMemberId;
      typeormEntity.tenantId = tenantId;
      typeormEntity.userId = userId;
      typeormEntity.role = TenantMemberRoleEnum.OWNER;
      typeormEntity.createdAt = now;
      typeormEntity.updatedAt = now;
      typeormEntity.deletedAt = null;

      const mockTenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantMemberAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantMemberAggregate,
      );

      const result = mapper.toDomainEntity(typeormEntity);

      expect(result).toBe(mockTenantMemberAggregate);
      expect(
        mockTenantMemberAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: tenantMemberId,
        tenantId: tenantId,
        userId: userId,
        role: TenantMemberRoleEnum.OWNER,
        createdAt: now,
        updatedAt: now,
      });
      expect(
        mockTenantMemberAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('toTypeormEntity', () => {
    it('should convert domain entity to TypeORM entity with all properties', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const tenantId = '223e4567-e89b-12d3-a456-426614174000';
      const userId = '323e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockTenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(tenantId),
          userId: new UserUuidValueObject(userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest
        .spyOn(mockTenantMemberAggregate, 'toPrimitives')
        .mockReturnValue({
          id: tenantMemberId,
          tenantId: tenantId,
          userId: userId,
          role: TenantMemberRoleEnum.ADMIN,
          createdAt: now,
          updatedAt: now,
        });

      const result = mapper.toTypeormEntity(mockTenantMemberAggregate);

      expect(result).toBeInstanceOf(TenantMemberTypeormEntity);
      expect(result.id).toBe(tenantMemberId);
      expect(result.tenantId).toBe(tenantId);
      expect(result.userId).toBe(userId);
      expect(result.role).toBe(TenantMemberRoleEnum.ADMIN);
      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
      expect(result.deletedAt).toBeNull();
      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);

      toPrimitivesSpy.mockRestore();
    });
  });
});
