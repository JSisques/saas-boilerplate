import { SagaLogCreateCommandHandler } from '@/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command-handler';
import { SagaLogDeleteCommandHandler } from '@/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command-handler';
import { SagaLogUpdateCommandHandler } from '@/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command-handler';
import { SagaInstanceCreatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-instance-created/saga-instance-created.event-handler';
import { SagaInstanceDeletedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-instance-deleted/saga-instance-deleted.event-handler';
import { SagaInstanceStatusChangedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-instance-status-changed/saga-instance-status-changed.event-handler';
import { SagaInstanceUpdatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-instance-updated/saga-instance-updated.event-handler';
import { SagaLogCreatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-log-created/saga-log-created.event-handler';
import { SagaLogDeletedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-log-deleted/saga-log-deleted.event-handler';
import { SagaLogUpdatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-log-updated/saga-log-updated.event-handler';
import { SagaStepCreatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-step-created/saga-step-created.event-handler';
import { SagaStepDeletedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-step-deleted/saga-step-deleted.event-handler';
import { SagaStepStatusChangedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-step-status-changed/saga-step-status-changed.event-handler';
import { SagaStepUpdatedEventHandler } from '@/saga-context/saga-log/application/event-handlers/saga-step-updated/saga-step-updated.event-handler';
import { FindSagaLogsByCriteriaQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.query-handler';
import { FindSagaLogByIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-id/saga-log-find-by-id.query-handler';
import { FindSagaLogsBySagaInstanceIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-saga-instance-id/saga-log-find-by-saga-instance-id.query-handler';
import { FindSagaLogsBySagaStepIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-by-saga-step-id/saga-log-find-by-saga-step-id.query-handler';
import { FindSagaLogViewModelByIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.query-handler';
import { FindSagaLogViewModelsBySagaInstanceIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.query-handler';
import { FindSagaLogViewModelsBySagaStepIdQueryHandler } from '@/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.query-handler';
import { AssertSagaLogExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service';
import { AssertSagaLogNotExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-not-exists/assert-saga-log-not-exists.service';
import { AssertSagaLogViewModelExistsService } from '@/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service';
import { SagaLogAggregateFactory } from '@/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory';
import { SagaLogViewModelFactory } from '@/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory';
import { SAGA_LOG_READ_REPOSITORY_TOKEN } from '@/saga-context/saga-log/domain/repositories/saga-log-read.repository';
import { SAGA_LOG_WRITE_REPOSITORY_TOKEN } from '@/saga-context/saga-log/domain/repositories/saga-log-write.repository';
import { SagaLogMongoDBMapper } from '@/saga-context/saga-log/infrastructure/database/mongodb/mappers/saga-log-mongodb.mapper';
import { SagaLogMongoRepository } from '@/saga-context/saga-log/infrastructure/database/mongodb/repositories/saga-log-mongodb.repository';
import { SagaLogPrismaMapper } from '@/saga-context/saga-log/infrastructure/database/prisma/mappers/saga-log-prisma.mapper';
import { SagaLogPrismaRepository } from '@/saga-context/saga-log/infrastructure/database/prisma/repositories/saga-log-prisma.repository';
import { SagaLogGraphQLMapper } from '@/saga-context/saga-log/transport/graphql/mappers/saga-log.mapper';
import { SagaLogMutationsResolver } from '@/saga-context/saga-log/transport/graphql/resolvers/saga-log-mutations.resolver';
import { SagaLogQueryResolver } from '@/saga-context/saga-log/transport/graphql/resolvers/saga-log-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const RESOLVERS = [SagaLogQueryResolver, SagaLogMutationsResolver];

const SERVICES = [
  AssertSagaLogExistsService,
  AssertSagaLogNotExistsService,
  AssertSagaLogViewModelExistsService,
];

const QUERY_HANDLERS = [
  FindSagaLogsByCriteriaQueryHandler,
  FindSagaLogByIdQueryHandler,
  FindSagaLogsBySagaInstanceIdQueryHandler,
  FindSagaLogsBySagaStepIdQueryHandler,

  // View models
  FindSagaLogViewModelByIdQueryHandler,
  FindSagaLogViewModelsBySagaInstanceIdQueryHandler,
  FindSagaLogViewModelsBySagaStepIdQueryHandler,
];

const COMMAND_HANDLERS = [
  SagaLogCreateCommandHandler,
  SagaLogUpdateCommandHandler,
  SagaLogDeleteCommandHandler,
];

const EVENT_HANDLERS = [
  // Saga log events
  SagaLogCreatedEventHandler,
  SagaLogUpdatedEventHandler,
  SagaLogDeletedEventHandler,

  // Saga instance events
  SagaInstanceCreatedEventHandler,
  SagaInstanceUpdatedEventHandler,
  SagaInstanceDeletedEventHandler,
  SagaInstanceStatusChangedEventHandler,

  // Saga step events
  SagaStepCreatedEventHandler,
  SagaStepUpdatedEventHandler,
  SagaStepDeletedEventHandler,
  SagaStepStatusChangedEventHandler,
];

const FACTORIES = [SagaLogAggregateFactory, SagaLogViewModelFactory];

const MAPPERS = [
  SagaLogPrismaMapper,
  SagaLogMongoDBMapper,
  SagaLogGraphQLMapper,
];

const REPOSITORIES = [
  {
    provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
    useClass: SagaLogPrismaRepository,
  },
  {
    provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
    useClass: SagaLogMongoRepository,
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
export class SagaLogModule {}
