import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';
import { TenantMemberUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-member-uuid/tenant-member-uuid.vo';
import { TenantUuidValueObject } from '@/shared/domain/value-objects/identifiers/tenant-uuid/tenant-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';
import { ITenantMemberCreateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-create/tenant-member-create.dto';
import { ITenantMemberUpdateDto } from '@/tenant-context/tenant-members/domain/dtos/entities/tenant-member-update/tenant-member-update.dto';
import { TenantMemberPrimitives } from '@/tenant-context/tenant-members/domain/primitives/tenant-member.primitives';
import { TenantMemberCreatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-created-at/tenant-member-created-at.vo';
import { TenantMemberRoleValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-role/tenant-member-role.vo';
import { TenantMemberUpdatedAtValueObject } from '@/tenant-context/tenant-members/domain/value-objects/tenant-member-updated-at/tenant-member-updated-at.vo';
import { AggregateRoot } from '@nestjs/cqrs';

export class TenantMemberAggregate extends AggregateRoot {
  private readonly _id: TenantMemberUuidValueObject;
  private _tenantId: TenantUuidValueObject;
  private _userId: UserUuidValueObject;
  private _role: TenantMemberRoleValueObject;
  private _createdAt: TenantMemberCreatedAtValueObject;
  private _updatedAt: TenantMemberUpdatedAtValueObject;

  constructor(props: ITenantMemberCreateDto, generateEvent: boolean = true) {
    super();

    // 01: Set the properties
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._userId = props.userId;
    this._role = props.role;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    // 02: Apply the creation event
    if (generateEvent) {
      this.apply(
        new TenantMemberAddedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantMemberAggregate.name,
            eventType: TenantMemberAddedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Update the tenant member.
   *
   * @param props - The properties to update the tenant member.
   * @param props.role - The role of the tenant member.
   */
  public update(props: ITenantMemberUpdateDto, generateEvent: boolean = true) {
    // 01: Update the properties
    this._role = props.role !== undefined ? props.role : this._role;

    this._updatedAt = new TenantMemberUpdatedAtValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new TenantMemberUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantMemberAggregate.name,
            eventType: TenantMemberUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Delete the tenant.
   *
   * @param generateEvent - Whether to generate the tenant deleted event. Default is true.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new TenantMemberRemovedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: TenantMemberAggregate.name,
            eventType: TenantMemberRemovedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Get the id of the tenant.
   *
   * @returns The id of the tenant.
   */
  public get id(): TenantUuidValueObject {
    return this._id;
  }

  /**
   * Get the tenant id of the tenant member.
   *
   * @returns The tenant id of the tenant member.
   */
  public get tenantId(): TenantUuidValueObject {
    return this._tenantId;
  }

  /**
   * Get the user id of the tenant member.
   *
   * @returns The user id of the tenant member.
   */
  public get userId(): UserUuidValueObject {
    return this._userId;
  }

  /**
   * Get the role of the tenant member.
   *
   * @returns The role of the tenant member.
   */
  public get role(): TenantMemberRoleValueObject {
    return this._role;
  }

  /**
   * Get the created at of the tenant member.
   *
   * @returns The created at of the tenant member.
   */
  public get createdAt(): TenantMemberCreatedAtValueObject {
    return this._createdAt;
  }
  /**
   * Get the updated at of the tenant member.
   *
   * @returns The updated at of the tenant member.
   */
  public get updatedAt(): TenantMemberUpdatedAtValueObject {
    return this._updatedAt;
  }

  /**
   * Convert the tenant aggregate to primitives.
   *
   * @returns The primitives of the tenant member.
   */
  public toPrimitives(): TenantMemberPrimitives {
    return {
      id: this._id.value,
      tenantId: this._tenantId.value,
      userId: this._userId.value,
      role: this._role.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
