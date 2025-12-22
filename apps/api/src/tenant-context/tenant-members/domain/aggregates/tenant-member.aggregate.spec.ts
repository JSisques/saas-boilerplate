import { TenantMemberRoleEnum } from '@/shared/domain/enums/tenant-context/tenant-members/tenant-member-role/tenant-member-role.enum';
import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { TenantMemberAggregate } from '@/tenant-context/tenant-members/domain/aggregates/tenant-member.aggregate';
import { ITenantMemberCreateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-create/tenant-member-create.dto';
import { ITenantMemberUpdateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-update/tenant-member-update.dto';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';

describe('TenantMemberAggregate', () => {
  const createProps = (): ITenantMemberCreateDto => {
    const now = new Date();
    return {
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
  };

  describe('constructor', () => {
    it('should create a TenantMemberAggregate with all properties', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate).toBeInstanceOf(TenantMemberAggregate);
      expect(aggregate.id.value).toBe(props.id.value);
      expect(aggregate.tenantId.value).toBe(props.tenantId.value);
      expect(aggregate.userId.value).toBe(props.userId.value);
      expect(aggregate.role.value).toBe(props.role.value);
      expect(aggregate.createdAt.value).toEqual(props.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(props.updatedAt.value);
    });

    it('should emit TenantMemberAddedEvent on creation by default', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props);

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantMemberAddedEvent);

      const event = events[0] as TenantMemberAddedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(TenantMemberAggregate.name);
      expect(event.eventType).toBe(TenantMemberAddedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit TenantMemberAddedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update the role and updatedAt timestamp', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      const beforeUpdate = aggregate.updatedAt.value.getTime();
      const updateDto: ITenantMemberUpdateDto = {
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN),
      };

      // Update should set a new timestamp
      aggregate.update(updateDto, false);

      expect(aggregate.role.value).toBe(TenantMemberRoleEnum.ADMIN);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update role when role is undefined', () => {
      const props = createProps();
      const originalRole = props.role.value;
      const aggregate = new TenantMemberAggregate(props, false);

      const updateDto: ITenantMemberUpdateDto = {};

      aggregate.update(updateDto, false);

      expect(aggregate.role.value).toBe(originalRole);
    });

    it('should emit TenantMemberUpdatedEvent on update by default', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      const updateDto: ITenantMemberUpdateDto = {
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN),
      };

      aggregate.update(updateDto);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantMemberUpdatedEvent);

      const event = events[0] as TenantMemberUpdatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(TenantMemberAggregate.name);
      expect(event.eventType).toBe(TenantMemberUpdatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit TenantMemberUpdatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      const updateDto: ITenantMemberUpdateDto = {
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.ADMIN),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should emit TenantMemberRemovedEvent on delete by default', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TenantMemberRemovedEvent);

      const event = events[0] as TenantMemberRemovedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(TenantMemberAggregate.name);
      expect(event.eventType).toBe(TenantMemberRemovedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit TenantMemberRemovedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('getters', () => {
    it('should return correct id', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.id).toBeInstanceOf(TenantMemberUuidValueObject);
      expect(aggregate.id.value).toBe(props.id.value);
    });

    it('should return correct tenantId', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.tenantId).toBeInstanceOf(TenantUuidValueObject);
      expect(aggregate.tenantId.value).toBe(props.tenantId.value);
    });

    it('should return correct userId', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.userId).toBeInstanceOf(UserUuidValueObject);
      expect(aggregate.userId.value).toBe(props.userId.value);
    });

    it('should return correct role', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.role).toBeInstanceOf(TenantMemberRoleValueObject);
      expect(aggregate.role.value).toBe(props.role.value);
    });

    it('should return correct createdAt', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.createdAt.value).toEqual(props.createdAt.value);
    });

    it('should return correct updatedAt', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt.value).toEqual(props.updatedAt.value);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: props.id.value,
        tenantId: props.tenantId.value,
        userId: props.userId.value,
        role: props.role.value,
        createdAt: props.createdAt.value,
        updatedAt: props.updatedAt.value,
      });
    });

    it('should reflect updated values in primitives', () => {
      const props = createProps();
      const aggregate = new TenantMemberAggregate(props, false);

      const updateDto: ITenantMemberUpdateDto = {
        role: new TenantMemberRoleValueObject(TenantMemberRoleEnum.OWNER),
      };

      aggregate.update(updateDto, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.role).toBe(TenantMemberRoleEnum.OWNER);
      expect(primitives.id).toBe(props.id.value);
      expect(primitives.tenantId).toBe(props.tenantId.value);
      expect(primitives.userId).toBe(props.userId.value);
    });
  });
});
