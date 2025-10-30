import { AuditCreatedEventHandler } from '@/audit-context/audit/application/event-handlers/audit/audit-created/audit-created.event-handler';
import { TenantMemberAddedEventHandler } from '@/audit-context/audit/application/event-handlers/tenant-context/tenant-members/tenant-members-added/tenant-members-added.event-handler';
import { TenantMemberRemovedEventHandler } from '@/audit-context/audit/application/event-handlers/tenant-context/tenant-members/tenant-members-removed/tenant-members-removed.event-handler';
import { TenantMemberUpdatedEventHandler } from '@/audit-context/audit/application/event-handlers/tenant-context/tenant-members/tenant-members-updated/tenant-members-updated.event-handler';
import { TenantCreatedEventHandler } from '@/audit-context/audit/application/event-handlers/tenant-context/tenants/tenant-created/tenant-created.event-handler';
import { TenantDeletedEventHandler } from '@/audit-context/audit/application/event-handlers/tenant-context/tenants/tenant-deleted/tenant-deleted.event-handler';
import { TenantUpdatedEventHandler } from '@/audit-context/audit/application/event-handlers/tenant-context/tenants/tenant-updated/tenant-updated.event-handler';
import { UserCreatedEventHandler } from '@/audit-context/audit/application/event-handlers/users/user-created/user-created.event-handler';
import { UserDeletedEventHandler } from '@/audit-context/audit/application/event-handlers/users/user-deleted/user-deleted.event-handler';
import { UserUpdatedEventHandler } from '@/audit-context/audit/application/event-handlers/users/user-updated/user-updated.event-handler';
import { FindAuditsByCriteriaQueryHandler } from '@/audit-context/audit/application/queries/find-audits-by-criteria/find-audits-by-criteria.command-handler';
import { AuditTrackingService } from '@/audit-context/audit/application/services/audit-tracking/audit-tracking.service';
import { AuditAggregateFactory } from '@/audit-context/audit/domain/factories/audit-aggregate.factory';
import { AuditViewModelFactory } from '@/audit-context/audit/domain/factories/audit-view-model.factory';
import { AUDIT_READ_REPOSITORY_TOKEN } from '@/audit-context/audit/domain/repositories/audit-read.repository';
import { AUDIT_WRITE_REPOSITORY_TOKEN } from '@/audit-context/audit/domain/repositories/audit-write.repository';
import { AuditMongoDBMapper } from '@/audit-context/audit/infrastructure/mongodb/mappers/audit-mongodb.mapper';
import { AuditMongoRepository } from '@/audit-context/audit/infrastructure/mongodb/repositories/audit-mongodb.repository';
import { AuditPrismaMapper } from '@/audit-context/audit/infrastructure/prisma/mappers/audit-prisma.mapper';
import { AuditPrismaRepository } from '@/audit-context/audit/infrastructure/prisma/repositories/audit-prisma.repository';
import { AuditGraphQLMapper } from '@/audit-context/audit/transport/graphql/mappers/audit.mapper';
import { AuditQueryResolver } from '@/audit-context/audit/transport/graphql/resolvers/audit-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [AuditQueryResolver];

const SERVICES = [AuditTrackingService];

const QUERY_HANDLERS = [FindAuditsByCriteriaQueryHandler];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [
  AuditCreatedEventHandler,

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
];

const FACTORIES = [AuditAggregateFactory, AuditViewModelFactory];

const MAPPERS = [AuditPrismaMapper, AuditMongoDBMapper, AuditGraphQLMapper];

const REPOSITORIES = [
  {
    provide: AUDIT_WRITE_REPOSITORY_TOKEN,
    useClass: AuditPrismaRepository,
  },
  {
    provide: AUDIT_READ_REPOSITORY_TOKEN,
    useClass: AuditMongoRepository,
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
export class AuditModule {}
