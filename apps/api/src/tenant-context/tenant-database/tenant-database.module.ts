import { SharedModule } from '@/shared/shared.module';
import { TenantDatabaseCreateCommandHandler } from '@/tenant-context/tenant-database/application/commands/tenant-database-create/tenant-database-create.command-handler';
import { TenantDatabaseDeleteCommandHandler } from '@/tenant-context/tenant-database/application/commands/tenant-database-delete/tenant-database-delete.command-handler';
import { TenantDatabaseUpdateCommandHandler } from '@/tenant-context/tenant-database/application/commands/tenant-database-update/tenant-database-update.command-handler';
import { TenantDatabaseCreatedEventHandler } from '@/tenant-context/tenant-database/application/event-handlers/tenant-database-created/tenant-database-created.event-handler';
import { TenantDatabaseDeletedEventHandler } from '@/tenant-context/tenant-database/application/event-handlers/tenant-database-deleted/tenant-database-deleted.event-handler';
import { TenantDatabaseUpdatedEventHandler } from '@/tenant-context/tenant-database/application/event-handlers/tenant-database-updated/tenant-database-updated.event-handler';
import { FindTenantDatabasesByCriteriaQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-criteria/tenant-database-find-by-criteria.query-handler';
import { FindTenantDatabaseByIdQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-database-find-by-id/tenant-database-find-by-id.query-handler';
import { FindTenantDatabaseByTenantIdQueryHandler } from '@/tenant-context/tenant-database/application/queries/tenant-member-find-by-tenant-id/tenant-database-find-by-tenant-id.query-handler';
import { AssertTenantDatabaseViewModelExsistsService } from '@/tenant-context/tenant-database/application/services/assert-database-view-model-exsits/assert-tenant-member-view-model-exsits.service';
import { AssertTenantDatabaseExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-exsits/assert-tenant-database-exsits.service';
import { AssertTenantDatabaseNotExsistsService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-not-exsits/assert-tenant-database-not-exsits.service';
import { AssertTenantDatabaseTenantIdIsUniqueService } from '@/tenant-context/tenant-database/application/services/assert-tenant-database-tenant-id-is-unique/assert-tenant-database-tenant-id-is-unique.service';
import { TenantDatabaseAggregateFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-aggregate/tenant-database-aggregate.factory';
import { TenantDatabaseViewModelFactory } from '@/tenant-context/tenant-database/domain/factories/tenant-database-view-model/tenant-database-view-model.factory';
import { TENANT_DATABASE_READ_REPOSITORY_TOKEN } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-read.repository';
import { TENANT_DATABASE_WRITE_REPOSITORY_TOKEN } from '@/tenant-context/tenant-database/domain/repositories/tenant-database-write.repository';
import { TenantDatabaseMongoDBMapper } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/mappers/tenant-database-mongodb.mapper';
import { TenantDatabaseMongoRepository } from '@/tenant-context/tenant-database/infrastructure/database/mongodb/repositories/tenant-database-mongodb.repository';
import { TenantDatabasePrismaMapper } from '@/tenant-context/tenant-database/infrastructure/database/prisma/mappers/tenant-database-prisma.mapper';
import { TenantDatabasePrismaRepository } from '@/tenant-context/tenant-database/infrastructure/database/prisma/repositories/tenant-database-prisma.repository';
import { TenantDatabaseGraphQLMapper } from '@/tenant-context/tenant-database/transport/graphql/mappers/tenant-database.mapper';
import { TenantDatabaseMutationsResolver } from '@/tenant-context/tenant-database/transport/graphql/resolvers/tenant-database-mutations.resolver';
import { TenantDatabaseQueryResolver } from '@/tenant-context/tenant-database/transport/graphql/resolvers/tenant-database-queries.resolver';
import { Module } from '@nestjs/common';

const RESOLVERS = [
  TenantDatabaseQueryResolver,
  TenantDatabaseMutationsResolver,
];

const QUERY_HANDLERS = [
  FindTenantDatabasesByCriteriaQueryHandler,
  FindTenantDatabaseByIdQueryHandler,
  FindTenantDatabaseByTenantIdQueryHandler,
];

const COMMAND_HANDLERS = [
  TenantDatabaseCreateCommandHandler,
  TenantDatabaseUpdateCommandHandler,
  TenantDatabaseDeleteCommandHandler,
];

const EVENT_HANDLERS = [
  TenantDatabaseCreatedEventHandler,
  TenantDatabaseUpdatedEventHandler,
  TenantDatabaseDeletedEventHandler,
];

const SERVICES = [
  AssertTenantDatabaseExsistsService,
  AssertTenantDatabaseNotExsistsService,
  AssertTenantDatabaseViewModelExsistsService,
  AssertTenantDatabaseTenantIdIsUniqueService,
];

const FACTORIES = [
  TenantDatabaseAggregateFactory,
  TenantDatabaseViewModelFactory,
];

const MAPPERS = [
  TenantDatabasePrismaMapper,
  TenantDatabaseMongoDBMapper,
  TenantDatabaseGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: TENANT_DATABASE_WRITE_REPOSITORY_TOKEN,
    useClass: TenantDatabasePrismaRepository,
  },
  {
    provide: TENANT_DATABASE_READ_REPOSITORY_TOKEN,
    useClass: TenantDatabaseMongoRepository,
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
export class TenantDatabaseModule {}
