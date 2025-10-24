import { AuditCreatedEventHandler } from '@/audit/application/event-handlers/audit/audit-created/audit-created.event-handler';
import { UserCreatedEventHandler } from '@/audit/application/event-handlers/users/user-created/user-created.event-handler';
import { UserDeletedEventHandler } from '@/audit/application/event-handlers/users/user-deleted/user-deleted.event-handler';
import { UserUpdatedEventHandler } from '@/audit/application/event-handlers/users/user-updated/user-updated.event-handler';
import { FindAuditsByCriteriaQueryHandler } from '@/audit/application/queries/find-audits-by-criteria/find-audits-by-criteria.command-handler';
import { AuditTrackingService } from '@/audit/application/services/audit-tracking/audit-tracking.service';
import {
  AUDIT_VIEW_MODEL_FACTORY_TOKEN,
  AuditViewModelFactory,
} from '@/audit/domain/factories/audit-view-model.factory';
import {
  AUDIT_FACTORY_TOKEN,
  AuditFactory,
} from '@/audit/domain/factories/audit.factory';
import { AUDIT_READ_REPOSITORY_TOKEN } from '@/audit/domain/repositories/audit-read.repository';
import { AUDIT_WRITE_REPOSITORY_TOKEN } from '@/audit/domain/repositories/audit-write.repository';
import {
  AUDIT_MONGODB_MAPPER_TOKEN,
  AuditMongoDBMapper,
} from '@/audit/infrastructure/mongodb/mappers/audit-mongodb.mapper';
import { AuditMongoRepository } from '@/audit/infrastructure/mongodb/repositories/audit-mongodb.repository';
import {
  AUDIT_PRISMA_MAPPER_TOKEN,
  AuditPrismaMapper,
} from '@/audit/infrastructure/prisma/mappers/audit-prisma.mapper';
import { AuditPrismaRepository } from '@/audit/infrastructure/prisma/repositories/audit-prisma.repository';
import {
  AUDIT_GRAPHQL_MAPPER_TOKEN,
  AuditGraphQLMapper,
} from '@/audit/transport/graphql/mappers/audit.mapper';
import { AuditQueryResolver } from '@/audit/transport/graphql/resolvers/audit-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [AuditQueryResolver];

const SERVICES = [AuditTrackingService];

const QUERY_HANDLERS = [FindAuditsByCriteriaQueryHandler];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [
  AuditCreatedEventHandler,
  UserCreatedEventHandler,
  UserDeletedEventHandler,
  UserUpdatedEventHandler,
];

const FACTORIES = [
  {
    provide: AUDIT_FACTORY_TOKEN,
    useClass: AuditFactory,
  },
  {
    provide: AUDIT_VIEW_MODEL_FACTORY_TOKEN,
    useClass: AuditViewModelFactory,
  },
];

const MAPPERS = [
  {
    provide: AUDIT_PRISMA_MAPPER_TOKEN,
    useClass: AuditPrismaMapper,
  },
  {
    provide: AUDIT_MONGODB_MAPPER_TOKEN,
    useClass: AuditMongoDBMapper,
  },
  {
    provide: AUDIT_GRAPHQL_MAPPER_TOKEN,
    useClass: AuditGraphQLMapper,
  },
];

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
