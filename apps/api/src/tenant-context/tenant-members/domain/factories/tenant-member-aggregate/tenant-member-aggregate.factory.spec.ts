import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { ITenantMemberCreateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-create/tenant-member-create.dto';
import { TenantMemberRoleEnum } from '@/tenant-context/tenant-members/domain/enums/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberPrimitives } from '@/tenant-context/tenant-members/domain/primitives/tenant-member.primitives';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';

describe('TenantMemberAggregateFactory', () => {
  let factory: TenantMemberAggregateFactory;

  beforeEach(() => {
    factory = new TenantMemberAggregateFactory();
  });

  describe('create', () => {
    it('should create a TenantMemberAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date();

      const dto: ITenantMemberCreateDto = {
        id: new TenantMemberUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: new UserUuidValueObject('323e4567-e89b-12d3-a456-426614174000'),
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.MEMBER),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(TenantMemberAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.userId.value).toBe(dto.userId.value);
      expect(aggregate.role.value).toBe(dto.role.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(TenantMemberAddedEvent);
    });

    it('should create a TenantMemberAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date();

      const dto: ITenantMemberCreateDto = {
        id: new TenantMemberUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        tenantId: new TenantUuidValueObject(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: new UserUuidValueObject('323e4567-e89b-12d3-a456-426614174000'),
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(TenantMemberAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.tenantId.value).toBe(dto.tenantId.value);
      expect(aggregate.userId.value).toBe(dto.userId.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a TenantMemberAggregate with different roles', () => {
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const dto: ITenantMemberCreateDto = {
          id: new TenantMemberUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          tenantId: new TenantUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          userId: new UserUuidValueObject(
            '323e4567-e89b-12d3-a456-426614174000',
          ),
          role: new TenantMemberRoleValueObject(role),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        };

        const aggregate = factory.create(dto, false);

        expect(aggregate.role.value).toBe(role);
      });
    });
  });

  describe('fromPrimitives', () => {
    it('should create a TenantMemberAggregate from primitives with all fields', () => {
      const now = new Date();
      const primitives: TenantMemberPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.MEMBER,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(TenantMemberAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.tenantId.value).toBe(primitives.tenantId);
      expect(aggregate.userId.value).toBe(primitives.userId);
      expect(aggregate.role.value).toBe(primitives.role);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create value objects correctly from primitives', () => {
      const now = new Date();
      const primitives: TenantMemberPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.OWNER,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.id).toBeInstanceOf(TenantMemberUuidValueObject);
      expect(aggregate.tenantId).toBeInstanceOf(TenantUuidValueObject);
      expect(aggregate.userId).toBeInstanceOf(UserUuidValueObject);
      expect(aggregate.role).toBeInstanceOf(TenantMemberRoleValueObject);
      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
    });

    it('should generate events when creating from primitives (default behavior)', () => {
      const now = new Date();
      const primitives: TenantMemberPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        tenantId: '223e4567-e89b-12d3-a456-426614174000',
        userId: '323e4567-e89b-12d3-a456-426614174000',
        role: TenantMemberRoleEnum.ADMIN,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      // fromPrimitives calls new TenantMemberAggregate without generateEvent parameter,
      // so it defaults to true and events will be generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(TenantMemberAddedEvent);
    });

    it('should handle different role values from primitives', () => {
      const now = new Date();
      const roles = [
        TenantMemberRoleEnum.OWNER,
        TenantMemberRoleEnum.ADMIN,
        TenantMemberRoleEnum.MEMBER,
        TenantMemberRoleEnum.GUEST,
      ];

      roles.forEach((role) => {
        const primitives: TenantMemberPrimitives = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          tenantId: '223e4567-e89b-12d3-a456-426614174000',
          userId: '323e4567-e89b-12d3-a456-426614174000',
          role,
          createdAt: now,
          updatedAt: now,
        };

        const aggregate = factory.fromPrimitives(primitives);

        expect(aggregate.role.value).toBe(role);
      });
    });
  });
});
