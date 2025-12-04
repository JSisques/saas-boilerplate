import { SagaInstanceChangeStatusCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command-handler';
import { SagaInstanceCreateCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command-handler';
import { SagaInstanceDeleteCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command-handler';
import { SagaInstanceUpdateCommandHandler } from '@/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command-handler';
import { SagaInstanceCreatedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-created/saga-instance-created.event-handler';
import { SagaInstanceDeletedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-deleted/saga-instance-deleted.event-handler';
import { SagaInstanceStatusChangedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-status-chaged/saga-instance-status-changed.event-handler';
import { SagaInstanceUpdatedEventHandler } from '@/saga-context/saga-instance/application/event-handlers/saga-instance-updated/tenant-member-updated.event-handler';
import { FindSagaInstancesByCriteriaQueryHandler } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query-handler';
import { FindSagaInstanceByIdQueryHandler } from '@/saga-context/saga-instance/application/queries/saga-instance-find-by-id/saga-instance-find-by-id.query-handler';
import { FindSagaInstanceViewModelByIdQueryHandler } from '@/saga-context/saga-instance/application/queries/tenant-member-find-view-model-by-id/saga-instance-find-view-model-by-id.query-handler';
import { AssertSagaInstanceExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service';
import { AssertSagaInstanceNotExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-not-exists/assert-saga-instance-not-exists.service';
import { AssertSagaInstanceViewModelExistsService } from '@/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service';
import { SagaInstanceAggregateFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory';
import { SagaInstanceViewModelFactory } from '@/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory';
import { SAGA_INSTANCE_READ_REPOSITORY_TOKEN } from '@/saga-context/saga-instance/domain/repositories/saga-instance-read.repository';
import { SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN } from '@/saga-context/saga-instance/domain/repositories/saga-instance-write.repository';
import { SagaInstanceMongoDBMapper } from '@/saga-context/saga-instance/infrastructure/database/mongodb/mappers/saga-instance-mongodb.mapper';
import { SagaInstanceMongoRepository } from '@/saga-context/saga-instance/infrastructure/database/mongodb/repositories/saga-instance-mongodb.repository';
import { SagaInstancePrismaMapper } from '@/saga-context/saga-instance/infrastructure/database/prisma/mappers/saga-instance-prisma.mapper';
import { SagaInstancePrismaRepository } from '@/saga-context/saga-instance/infrastructure/database/prisma/repositories/saga-instance-prisma.repository';
import { SagaInstanceGraphQLMapper } from '@/saga-context/saga-instance/transport/graphql/mappers/saga-instance.mapper';
import { SagaInstanceMutationsResolver } from '@/saga-context/saga-instance/transport/graphql/resolvers/saga-instance-mutations.resolver';
import { SagaInstanceQueryResolver } from '@/saga-context/saga-instance/transport/graphql/resolvers/saga-instance-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [SagaInstanceQueryResolver, SagaInstanceMutationsResolver];

const SERVICES = [
  AssertSagaInstanceExistsService,
  AssertSagaInstanceNotExistsService,
  AssertSagaInstanceViewModelExistsService,
];

const QUERY_HANDLERS = [
  FindSagaInstancesByCriteriaQueryHandler,
  FindSagaInstanceByIdQueryHandler,

  // View models
  FindSagaInstanceViewModelByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  SagaInstanceCreateCommandHandler,
  SagaInstanceUpdateCommandHandler,
  SagaInstanceDeleteCommandHandler,
  SagaInstanceChangeStatusCommandHandler,
];

const EVENT_HANDLERS = [
  SagaInstanceCreatedEventHandler,
  SagaInstanceUpdatedEventHandler,
  SagaInstanceDeletedEventHandler,
  SagaInstanceStatusChangedEventHandler,
];

const FACTORIES = [SagaInstanceAggregateFactory, SagaInstanceViewModelFactory];

const MAPPERS = [
  SagaInstancePrismaMapper,
  SagaInstanceMongoDBMapper,
  SagaInstanceGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
    useClass: SagaInstancePrismaRepository,
  },
  {
    provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
    useClass: SagaInstanceMongoRepository,
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
export class SagaInstanceModule {}
