import { SharedModule } from '@/shared/shared.module';
import { TenantMemberAddCommandHandler } from '@/tenant-context/tenant-members/application/commands/tenant-member-add/tenant-member-add.command-handler';
import { TenantMemberRemoveCommandHandler } from '@/tenant-context/tenant-members/application/commands/tenant-member-remove/tenant-member-remove.command-handler';
import { TenantMemberUpdateCommandHandler } from '@/tenant-context/tenant-members/application/commands/tenant-member-update/tenant-member-update.command-handler';
import { TenantMemberAddedEventHandler } from '@/tenant-context/tenant-members/application/event-handlers/tenant-member-added/tenant-member-added.event-handler';
import { TenantMemberRemovedEventHandler } from '@/tenant-context/tenant-members/application/event-handlers/tenant-member-deleted/tenant-member-deleted.event-handler';
import { TenantMemberUpdatedEventHandler } from '@/tenant-context/tenant-members/application/event-handlers/tenant-member-updated/tenant-member-updated.event-handler';
import { FindTenantMembersByCriteriaQueryHandler } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-criteria/tenant-member-find-by-criteria.query-handler';
import { FindTenantMemberByIdQueryHandler } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-id/tenant-member-find-by-id.query-handler';
import { FindTenantMemberByTenantIdQueryHandler } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-tenant-id/tenant-member-find-by-tenant-id.query-handler';
import { FindTenantMemberByUserIdQueryHandler } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-by-user-id/tenant-member-find-by-user-id.query-handler';
import { FindTenantMemberViewModelByIdQueryHandler } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-view-model-by-id/tenant-member-find-view-model-by-id.query-handler';
import { FindTenantMemberViewModelByTenantIdQueryHandler } from '@/tenant-context/tenant-members/application/queries/tenant-member-find-view-model-by-tenant-id/tenant-member-find-view-model-by-tenant-id.query-handler';
import { AssertTenantMemberExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-exsits/assert-tenant-member-exsits.service';
import { AssertTenantMemberNotExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-not-exsits/assert-tenant-member-not-exsits.service';
import { AssertTenantMemberViewModelExsistsService } from '@/tenant-context/tenant-members/application/services/assert-tenant-member-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { TenantMemberAggregateFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-aggregate/tenant-member-aggregate.factory';
import { TenantMemberViewModelFactory } from '@/tenant-context/tenant-members/domain/factories/tenant-member-view-model/tenant-member-view-model.factory';
import { TENANT_MEMBER_READ_REPOSITORY_TOKEN } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-read.repository';
import { TENANT_MEMBER_WRITE_REPOSITORY_TOKEN } from '@/tenant-context/tenant-members/domain/repositories/tenant-member-write.repository';
import { TenantMemberMongoDBMapper } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/mappers/tenant-member-mongodb.mapper';
import { TenantMemberMongoRepository } from '@/tenant-context/tenant-members/infrastructure/database/mongodb/repositories/tenant-member-mongodb.repository';
import { TenantMemberPrismaMapper } from '@/tenant-context/tenant-members/infrastructure/database/prisma/mappers/tenant-member-prisma.mapper';
import { TenantMemberPrismaRepository } from '@/tenant-context/tenant-members/infrastructure/database/prisma/repositories/tenant-member-prisma.repository';
import { TenantMemberGraphQLMapper } from '@/tenant-context/tenant-members/transport/graphql/mappers/tenant-member.mapper';
import { TenantMemberMutationsResolver } from '@/tenant-context/tenant-members/transport/graphql/resolvers/tenant-member-mutations.resolver';
import { TenantMemberQueryResolver } from '@/tenant-context/tenant-members/transport/graphql/resolvers/tenant-member-queries.resolver';
import { Module } from '@nestjs/common';

const RESOLVERS = [TenantMemberQueryResolver, TenantMemberMutationsResolver];

const SERVICES = [
  AssertTenantMemberExsistsService,
  AssertTenantMemberNotExsistsService,
  AssertTenantMemberViewModelExsistsService,
];

const QUERY_HANDLERS = [
  FindTenantMembersByCriteriaQueryHandler,
  FindTenantMemberByIdQueryHandler,
  FindTenantMemberByTenantIdQueryHandler,
  FindTenantMemberByUserIdQueryHandler,

  // View models
  FindTenantMemberViewModelByTenantIdQueryHandler,
  FindTenantMemberViewModelByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  TenantMemberAddCommandHandler,
  TenantMemberUpdateCommandHandler,
  TenantMemberRemoveCommandHandler,
];

const EVENT_HANDLERS = [
  TenantMemberAddedEventHandler,
  TenantMemberUpdatedEventHandler,
  TenantMemberRemovedEventHandler,
];

const FACTORIES = [TenantMemberAggregateFactory, TenantMemberViewModelFactory];

const MAPPERS = [
  TenantMemberPrismaMapper,
  TenantMemberMongoDBMapper,
  TenantMemberGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: TENANT_MEMBER_WRITE_REPOSITORY_TOKEN,
    useClass: TenantMemberPrismaRepository,
  },
  {
    provide: TENANT_MEMBER_READ_REPOSITORY_TOKEN,
    useClass: TenantMemberMongoRepository,
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
export class TenantMemberModule {}
