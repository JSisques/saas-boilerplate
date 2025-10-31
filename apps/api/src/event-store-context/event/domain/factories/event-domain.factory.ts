import { BaseEvent } from '@/shared/domain/events/base-event.interface';
import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { Injectable } from '@nestjs/common';

// Auth
import { AuthCreatedEvent } from '@/shared/domain/events/auth/auth-created/auth-created.event';
import { AuthDeletedEvent } from '@/shared/domain/events/auth/auth-deleted/auth-deleted.event';
import { AuthLoggedInByEmailEvent } from '@/shared/domain/events/auth/auth-logged-in-by-email/auth-logged-in-by-email.event';
import { AuthRegisteredByEmailEvent } from '@/shared/domain/events/auth/auth-registered-by-email/auth-registered-by-email.event';
import { AuthUpdatedLastLoginAtEvent } from '@/shared/domain/events/auth/auth-updated-last-login-at/auth-updated-last-login-at.event';
import { AuthUpdatedEvent } from '@/shared/domain/events/auth/auth-updated/auth-updated.event';

// Users
import { UserCreatedEvent } from '@/shared/domain/events/users/user-created/user-created.event';
import { UserDeletedEvent } from '@/shared/domain/events/users/user-deleted/user-deleted.event';
import { UserUpdatedEvent } from '@/shared/domain/events/users/user-updated/user-updated.event';

// Tenants
import { TenantCreatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-created/tenant-created.event';
import { TenantDeletedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-deleted/tenant-deleted.event';
import { TenantUpdatedEvent } from '@/shared/domain/events/tenant-context/tenants/tenant-updated/tenant-updated.event';

// Tenant Members
import { TenantMemberAddedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-added/tenant-members-created.event';
import { TenantMemberRemovedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event';
import { TenantMemberUpdatedEvent } from '@/shared/domain/events/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event';

type Constructor<T> = new (metadata: IEventMetadata, data: any) => T;

@Injectable()
export class DomainEventFactory {
  private readonly registry: Record<string, Constructor<BaseEvent<any>>> = {
    // Auth
    [AuthCreatedEvent.name]: AuthCreatedEvent,
    [AuthDeletedEvent.name]: AuthDeletedEvent,
    [AuthLoggedInByEmailEvent.name]: AuthLoggedInByEmailEvent,
    [AuthRegisteredByEmailEvent.name]: AuthRegisteredByEmailEvent,
    [AuthUpdatedEvent.name]: AuthUpdatedEvent,
    [AuthUpdatedLastLoginAtEvent.name]: AuthUpdatedLastLoginAtEvent,

    // Users
    [UserCreatedEvent.name]: UserCreatedEvent,
    [UserDeletedEvent.name]: UserDeletedEvent,
    [UserUpdatedEvent.name]: UserUpdatedEvent,

    // Tenants
    [TenantCreatedEvent.name]: TenantCreatedEvent,
    [TenantDeletedEvent.name]: TenantDeletedEvent,
    [TenantUpdatedEvent.name]: TenantUpdatedEvent,

    // Tenant Members
    [TenantMemberAddedEvent.name]: TenantMemberAddedEvent,
    [TenantMemberRemovedEvent.name]: TenantMemberRemovedEvent,
    [TenantMemberUpdatedEvent.name]: TenantMemberUpdatedEvent,
  };

  create(
    eventType: string,
    metadata: IEventMetadata,
    data: any,
  ): BaseEvent<any> {
    const EventCtor = this.registry[eventType];
    if (!EventCtor) {
      // TODO: Handle this error gracefully by returning a custom error in domain/exceptions
      throw new Error(`Unsupported eventType for replay: ${eventType}`);
    }
    return new EventCtor(metadata, data);
  }
}
