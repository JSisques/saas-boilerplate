import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberPrismaDto } from '@/tenant-context/tenant-members/infrastructure/database/prisma/dtos/tenant-member-prisma.dto';
import { TenantMemberRoleEnum as PrismaTenantMemberRoleEnum } from '@prisma/client';
import { TenantMemberPrismaMapper } from './tenant-member-prisma.mapper';

describe('TenantMemberPrismaMapper', () => {
  let mapper: TenantMemberPrismaMapper;
  let mockTenantMemberAggregateFactory: jest.Mocked<TenantMemberAggregateFactory>;

  beforeEach(() => {
    mockTenantMemberAggregateFactory = {
      create: jest.fn(),
      fromPrimitives: jest.fn(),
    } as unknown as jest.Mocked<TenantMemberAggregateFactory>;

    mapper = new TenantMemberPrismaMapper(mockTenantMemberAggregateFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toDomainEntity', () => {
    it('should convert Prisma data to domain entity with all properties', () => {
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

      const mockTenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(prismaData.tenantId),
          userId: new UserUuidValueObject(prismaData.userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockTenantMemberAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantMemberAggregate,
      );

      const result = mapper.toDomainEntity(prismaData);

      expect(result).toBe(mockTenantMemberAggregate);
      expect(
        mockTenantMemberAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith({
        id: tenantMemberId,
        tenantId: prismaData.tenantId,
        userId: prismaData.userId,
        role: prismaData.role,
        createdAt: now,
        updatedAt: now,
      });
      expect(
        mockTenantMemberAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledTimes(1);
    });

    it('should convert Prisma data with different roles', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const roles = [
        PrismaTenantMemberRoleEnum.OWNER,
        PrismaTenantMemberRoleEnum.ADMIN,
        PrismaTenantMemberRoleEnum.MEMBER,
        PrismaTenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const prismaData: TenantMemberPrismaDto = {
          id: tenantMemberId,
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt: now,
          updatedAt: now,
        };

        const mockTenantMemberAggregate = new TenantMemberAggregate(
          {
            id: new TenantMemberUuidValueObject(tenantMemberId),
            tenantId: new TenantUuidValueObject(prismaData.tenantId),
            userId: new UserUuidValueObject(prismaData.userId),
            role: new TenantMemberRoleValueObject(role as TenantMemberRoleEnum),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        mockTenantMemberAggregateFactory.fromPrimitives.mockReturnValue(
          mockTenantMemberAggregate,
        );

        const result = mapper.toDomainEntity(prismaData);

        expect(result).toBe(mockTenantMemberAggregate);
        expect(
          mockTenantMemberAggregateFactory.fromPrimitives,
        ).toHaveBeenCalledWith({
          id: tenantMemberId,
          tenantId: prismaData.tenantId,
          userId: prismaData.userId,
          role,
          createdAt: now,
          updatedAt: now,
        });

        jest.clearAllMocks();
      });
    });

    it('should convert Date objects correctly', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-02T10:00:00Z');

      const prismaData: TenantMemberPrismaDto = {
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: PrismaTenantMemberRoleEnum.MEMBER,
        createdAt,
        updatedAt,
      };

      const mockTenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(prismaData.tenantId),
          userId: new UserUuidValueObject(prismaData.userId),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
          createdAt: new DateValueObject(createdAt),
          updatedAt: new DateValueObject(updatedAt),
        },
        false,
      );

      mockTenantMemberAggregateFactory.fromPrimitives.mockReturnValue(
        mockTenantMemberAggregate,
      );

      mapper.toDomainEntity(prismaData);

      expect(
        mockTenantMemberAggregateFactory.fromPrimitives,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('toPrismaData', () => {
    it('should convert domain entity to Prisma data with all properties', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const tenantMemberAggregate = new TenantMemberAggregate(
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

      const result = mapper.toPrismaData(tenantMemberAggregate);

      expect(result).toEqual({
        id: tenantMemberId,
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert domain entity with different roles', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const tenantMemberAggregate = new TenantMemberAggregate(
          {
            id: new TenantMemberUuidValueObject(tenantMemberId),
            tenantId: new TenantUuidValueObject(
              '223e4567-e89b-12d3-a456-426614174000',
            ),
            userId: new UserUuidValueObject(
              '323e4567-e89b-12d3-a456-426614174000',
            ),
            role: new TenantMemberRoleValueObject(role),
            createdAt: new DateValueObject(now),
            updatedAt: new DateValueObject(now),
          },
          false,
        );

        const result = mapper.toPrismaData(tenantMemberAggregate);

        expect(result.role).toBe(role);
      });
    });

    it('should use toPrimitives from aggregate', () => {
      const tenantMemberId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const tenantMemberAggregate = new TenantMemberAggregate(
        {
          id: new TenantMemberUuidValueObject(tenantMemberId),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const toPrimitivesSpy = jest.spyOn(tenantMemberAggregate, 'toPrimitives');

      mapper.toPrismaData(tenantMemberAggregate);

      expect(toPrimitivesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
