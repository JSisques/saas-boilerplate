import { EventReplayCommandHandler } from '@/event-store-context/event/application/commands/event-replay/event-replay.command-handler';
import { AuthCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/auth-context/auths/auth-created/auth-created.event-handler';
import { AuthDeletedEventHandler } from '@/event-store-context/event/application/event-handlers/auth-context/auths/auth-deleted/auth-deleted.event-handler';
import { AuthUpdatedLastLoginAtEventHandler } from '@/event-store-context/event/application/event-handlers/auth-context/auths/auth-updated-last-login-at/auth-updated-last-login-at.vent-handler';
import { AuthUpdatedEventHandler } from '@/event-store-context/event/application/event-handlers/auth-context/auths/auth-updated/auth-updated.event-handler';
import { SubscriptionPlanCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/billing-context/subscription-plan/subscription-plan-created/subscription-plan-created.event-handler';
import { SubscriptionPlanDeletedEventHandler } from '@/event-store-context/event/application/event-handlers/billing-context/subscription-plan/subscription-plan-deleted/subscription-plan-deleted.event-handler';
import { SubscriptionPlanUpdatedEventHandler } from '@/event-store-context/event/application/event-handlers/billing-context/subscription-plan/subscription-plan-updated/subscription-plan-updated.event-handler';
import { EventCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/event/event-created/event-created.event-handler';
import { TenantMemberAddedEventHandler } from '@/event-store-context/event/application/event-handlers/tenant-context/tenant-members/tenant-members-added/tenant-members-added.event-handler';
import { TenantMemberRemovedEventHandler } from '@/event-store-context/event/application/event-handlers/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event-handler';
import { TenantMemberUpdatedEventHandler } from '@/event-store-context/event/application/event-handlers/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event-handler';
import { TenantCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/tenant-context/tenants/tenant-created/tenant-created.event-handler';
import { TenantDeletedEventHandler } from '@/event-store-context/event/application/event-handlers/tenant-context/tenants/tenant-deleted/tenant-deleted.event-handler';
import { TenantUpdatedEventHandler } from '@/event-store-context/event/application/event-handlers/tenant-context/tenants/tenant-updated/tenant-updated.event-handler';
import { UserCreatedEventHandler } from '@/event-store-context/event/application/event-handlers/users/user-created/user-created.event-handler';
import { UserDeletedEventHandler } from '@/event-store-context/event/application/event-handlers/users/user-deleted/user-deleted.event-handler';
import { UserUpdatedEventHandler } from '@/event-store-context/event/application/event-handlers/users/user-updated/user-updated.event-handler';
import { FindEventsByCriteriaQueryHandler } from '@/event-store-context/event/application/queries/event-find-by-criteria/event-find-by-criteria.command-handler';
import { EventPublishService } from '@/event-store-context/event/application/services/event-publish/event-publish.service';
import { EventReplayService } from '@/event-store-context/event/application/services/event-replay/event-replay.service';
import { EventTrackingService } from '@/event-store-context/event/application/services/event-tracking/event-tracking.service';
import { EventAggregateFactory } from '@/event-store-context/event/domain/factories/event-aggregate.factory';
import { DomainEventFactory } from '@/event-store-context/event/domain/factories/event-domain.factory';
import { EventViewModelFactory } from '@/event-store-context/event/domain/factories/event-view-model.factory';
import { EVENT_READ_REPOSITORY_TOKEN } from '@/event-store-context/event/domain/repositories/event-read.repository';
import { EVENT_WRITE_REPOSITORY_TOKEN } from '@/event-store-context/event/domain/repositories/event-write.repository';
import { EventMongoMapper } from '@/event-store-context/event/infrastructure/mongodb/mappers/event-mongodb.mapper';
import { EventMongoRepository } from '@/event-store-context/event/infrastructure/mongodb/repositories/event-mongodb.repository';
import { EventPrismaMapper } from '@/event-store-context/event/infrastructure/prisma/mappers/event-prisma.mapper';
import { EventPrismaRepository } from '@/event-store-context/event/infrastructure/prisma/repositories/event-prisma.repository';
import { EventGraphQLMapper } from '@/event-store-context/event/transport/graphql/mappers/event.mapper';
import { EventMutationResolver } from '@/event-store-context/event/transport/graphql/resolvers/event-mutations.resolver';
import { EventQueryResolver } from '@/event-store-context/event/transport/graphql/resolvers/event-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [EventQueryResolver, EventMutationResolver];

const SERVICES = [
  EventTrackingService,
  EventReplayService,
  EventPublishService,
];

const QUERY_HANDLERS = [FindEventsByCriteriaQueryHandler];

const COMMAND_HANDLERS = [EventReplayCommandHandler];

const EVENT_HANDLERS = [
  EventCreatedEventHandler,

  // Auths
  AuthCreatedEventHandler,
  AuthDeletedEventHandler,
  AuthUpdatedEventHandler,
  AuthUpdatedLastLoginAtEventHandler,

  // Users
  UserCreatedEventHandler,
  UserDeletedEventHandler,
  UserUpdatedEventHandler,

  // Tenants
  TenantCreatedEventHandler,
  TenantDeletedEventHandler,
  TenantUpdatedEventHandler,

  // Tenant members
  TenantMemberAddedEventHandler,
  TenantMemberUpdatedEventHandler,
  TenantMemberRemovedEventHandler,

  // Subscription plans
  SubscriptionPlanCreatedEventHandler,
  SubscriptionPlanUpdatedEventHandler,
  SubscriptionPlanDeletedEventHandler,
];

const FACTORIES = [
  EventAggregateFactory,
  EventViewModelFactory,
  DomainEventFactory,
];

const MAPPERS = [EventPrismaMapper, EventMongoMapper, EventGraphQLMapper];

const REPOSITORIES = [
  {
    provide: EVENT_WRITE_REPOSITORY_TOKEN,
    useClass: EventPrismaRepository,
  },
  {
    provide: EVENT_READ_REPOSITORY_TOKEN,
    useClass: EventMongoRepository,
  },
];

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...REPOSITORIES,
    ...FACTORIES,
    ...MAPPERS,
  ],
})
export class EventModule {}
