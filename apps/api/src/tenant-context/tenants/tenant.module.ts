import { SharedModule } from '@/shared/shared.module';
import { TenantCreateCommandHandler } from '@/tenant-context/tenants/application/commands/tenant-create/tenant-create.command-handler';
import { TenantDeleteCommandHandler } from '@/tenant-context/tenants/application/commands/tenant-delete/tenant-delete.command-handler';
import { TenantUpdateCommandHandler } from '@/tenant-context/tenants/application/commands/tenant-update/tenant-update.command-handler';
import { TenantCreatedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-created/tenant-created.event-handler';
import { TenantDeletedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-deleted/tenant-deleted.event-handler';
import { TenantMemberAddedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-member-added/tenant-member-added.event-handler';
import { TenantUpdatedEventHandler } from '@/tenant-context/tenants/application/event-handlers/tenant-updated/tenant-updated.event-handler';
import { FindTenantByIdQueryHandler } from '@/tenant-context/tenants/application/queries/find-tenant-by-id/find-tenant-by-id.query-handler';
import { FindTenantsByCriteriaQueryHandler } from '@/tenant-context/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query-handler';
import { AssertTenantExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-exsits/assert-tenant-exsits.service';
import { AssertTenantSlugIsUniqueService } from '@/tenant-context/tenants/application/services/assert-tenant-slug-is-unique/assert-tenant-slug-is-unique.service';
import { AssertTenantViewModelExsistsService } from '@/tenant-context/tenants/application/services/assert-tenant-view-model-exsits/assert-tenant-view-model-exsits.service';
import { TenantAggregateFactory } from '@/tenant-context/tenants/domain/factories/tenant-aggregate/tenant-aggregate.factory';
import { TenantViewModelFactory } from '@/tenant-context/tenants/domain/factories/tenant-view-model/tenant-view-model.factory';
import { TENANT_READ_REPOSITORY_TOKEN } from '@/tenant-context/tenants/domain/repositories/tenant-read.repository';
import { TENANT_WRITE_REPOSITORY_TOKEN } from '@/tenant-context/tenants/domain/repositories/tenant-write.repository';
import { TenantMongoDBMapper } from '@/tenant-context/tenants/infrastructure/database/mongodb/mappers/tenant-mongodb.mapper';
import { TenantMongoRepository } from '@/tenant-context/tenants/infrastructure/database/mongodb/repositories/tenant-mongodb.repository';
import { TenantTypeormEntity } from '@/tenant-context/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { TenantTypeormMapper } from '@/tenant-context/tenants/infrastructure/database/typeorm/mappers/tenant-typeorm.mapper';
import { TenantTypeormRepository } from '@/tenant-context/tenants/infrastructure/database/typeorm/repositories/tenant-typeorm.repository';
import { TenantGraphQLMapper } from '@/tenant-context/tenants/transport/graphql/mappers/tenant.mapper';
import { TenantMutationsResolver } from '@/tenant-context/tenants/transport/graphql/resolvers/tenant-mutations.resolver';
import { TenantQueryResolver } from '@/tenant-context/tenants/transport/graphql/resolvers/tenant-queries.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [TenantQueryResolver, TenantMutationsResolver];

const SERVICES = [
  AssertTenantExsistsService,
  AssertTenantSlugIsUniqueService,
  AssertTenantViewModelExsistsService,
];

const QUERY_HANDLERS = [
  FindTenantsByCriteriaQueryHandler,
  FindTenantByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  TenantCreateCommandHandler,
  TenantUpdateCommandHandler,
  TenantDeleteCommandHandler,
];

const EVENT_HANDLERS = [
  TenantCreatedEventHandler,
  TenantUpdatedEventHandler,
  TenantDeletedEventHandler,
  TenantMemberAddedEventHandler,
];

const SAGAS = [];

const FACTORIES = [TenantAggregateFactory, TenantViewModelFactory];

const MAPPERS = [TenantTypeormMapper, TenantMongoDBMapper, TenantGraphQLMapper];

const REPOSITORIES = [
  {
    provide: TENANT_WRITE_REPOSITORY_TOKEN,
    useClass: TenantTypeormRepository,
  },
  {
    provide: TENANT_READ_REPOSITORY_TOKEN,
    useClass: TenantMongoRepository,
  },
];

const ENTITIES = [TenantTypeormEntity];

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature(ENTITIES)],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...SAGAS,
    ...REPOSITORIES,
    ...FACTORIES,
    ...MAPPERS,
  ],
})
export class TenantModule {}
